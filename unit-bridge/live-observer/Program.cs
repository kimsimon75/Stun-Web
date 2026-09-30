using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

var baseDir = AppContext.BaseDirectory;
var settings = ReadEnv(Path.Combine(baseDir, ".env"));
var endpoint = settings.GetValueOrDefault("UNIT_API_URL", "https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots");
var token = settings.GetValueOrDefault("UNIT_BRIDGE_TOKEN", "");
if (!Uri.TryCreate(endpoint, UriKind.Absolute, out var endpointUri) || endpointUri.Scheme != Uri.UriSchemeHttps
    || token.Length != 64 || token.Any(c => !Uri.IsHexDigit(c)))
{
    Console.Error.WriteLine("EXE 옆 .env의 UNIT_API_URL과 UNIT_BRIDGE_TOKEN을 확인하세요.");
    Pause(); return 1;
}
File.WriteAllText(Path.Combine(baseDir, "web-read-token.txt"), Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes("stun-read-v1:" + token))).ToLowerInvariant() + Environment.NewLine);
Console.WriteLine("Stun Live Link — ORDR 2.323 게임 중 현재 유닛 집계");
Console.WriteLine("웹 연결 코드는 EXE 옆 web-read-token.txt에 있습니다.");
Console.WriteLine("워크래프트와 맵을 기다립니다. 종료: Ctrl+C");

using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var cancellation = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cancellation.Cancel(); };
string lastFingerprint = "", lastStatus = "";
var emptyObserverReads = 0;

while (!cancellation.IsCancellationRequested)
{
    using var observer = ObserverMemory.TryOpen();
    if (observer is null)
    {
        var warcraftRunning=System.Diagnostics.Process.GetProcessesByName("Warcraft III").Length>0;
        Status(warcraftRunning
            ? "Warcraft는 실행 중이지만 관전자 API가 열리지 않았습니다 · 플레이어 모드에서는 실시간 유닛 정보가 제공되지 않습니다"
            : "워크래프트 공유 메모리 대기 중", ref lastStatus);
        await Delay(cancellation.Token); continue;
    }
    observer.SetRefreshRate(500);
    uint lastGameTime=uint.MaxValue;var frozenTicks=0;
    while (!cancellation.IsCancellationRequested)
    {
        var snapshot = observer.ReadStable();
        if (snapshot is null || !snapshot.InGame)
        {
            var warcraftRunning=System.Diagnostics.Process.GetProcessesByName("Warcraft III").Length>0;
            var empty=snapshot is not null && snapshot.GameTimeMs==0 && snapshot.MapName.Length==0 && snapshot.Players.Count==0;
            emptyObserverReads=warcraftRunning&&empty?emptyObserverReads+1:0;
            Status(emptyObserverReads>=3
                ? "Warcraft는 실행 중이지만 관전자 API 데이터가 없습니다 · 플레이어 모드에서는 실시간 유닛 정보가 제공되지 않습니다"
                : "게임 시작 대기 중", ref lastStatus);
            await Delay(cancellation.Token); continue;
        }
        emptyObserverReads=0;
        frozenTicks=snapshot.GameTimeMs==lastGameTime?frozenTicks+1:0;lastGameTime=snapshot.GameTimeMs;
        if(frozenTicks>=5){Status("게임 상태 다시 연결 중",ref lastStatus);break;}
        if (!snapshot.MapName.Contains("ORDR", StringComparison.OrdinalIgnoreCase) && !snapshot.MapName.Contains("2.323", StringComparison.OrdinalIgnoreCase))
        {
            Status($"지원 맵 대기 중: {snapshot.MapName}", ref lastStatus);
            await Delay(cancellation.Token); continue;
        }
        var json = JsonSerializer.Serialize(new { kind="live-observer", mapVersion="2.323", gameTimeMs=snapshot.GameTimeMs, mapName=snapshot.MapName, players=snapshot.Players, units=snapshot.Units });
        var fingerprint = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(json)));
        if (fingerprint != lastFingerprint)
        {
            try
            {
                using var body = new StringContent(json, Encoding.UTF8, "application/json");
                using var response = await http.PostAsync(endpointUri, body, cancellation.Token);
                if (!response.IsSuccessStatusCode) throw new HttpRequestException($"HTTP {(int)response.StatusCode}");
                lastFingerprint = fingerprint;
                Status($"전송 완료 · 게임 {snapshot.GameTimeMs/60000}:{snapshot.GameTimeMs/1000%60:00} · 플레이어 {snapshot.Players.Count}명 · 유닛 {snapshot.Units.Sum(u=>u.count)}개", ref lastStatus);
            }
            catch (OperationCanceledException) when (cancellation.IsCancellationRequested) { break; }
            catch (Exception e) { Status($"전송 실패: {e.Message} · 다음 주기에 재시도", ref lastStatus); }
        }
        await Delay(cancellation.Token);
    }
}
return 0;

static async Task Delay(CancellationToken token) { try { await Task.Delay(2000, token); } catch (OperationCanceledException) { } }
static void Status(string value, ref string previous) { if (value == previous) return; previous=value; Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {value}"); }
static void Pause() { if (!Console.IsInputRedirected) { Console.WriteLine("Enter로 종료"); Console.ReadLine(); } }
static Dictionary<string,string> ReadEnv(string path)
{
    var result=new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);
    if (!File.Exists(path)) return result;
    foreach(var raw in File.ReadLines(path)) { var line=raw.Trim(); if(line.Length==0||line.StartsWith('#'))continue; var i=line.IndexOf('='); if(i>0)result[line[..i].Trim()]=line[(i+1)..].Trim().Trim('"'); }
    return result;
}

sealed class ObserverMemory : IDisposable
{
    const string MappingName = "War3StatsObserverSharedMemory";
    const int GameOffset = 8, GameSize = 518, PlayersOffset = GameOffset + GameSize;
    const int PlayerSize = 6_416_738, MaxPlayers = 24;
    const int PlayerIdOffset = 38, PlayerTypeOffset = 41, SlotStateOffset = 47;
    const int FoodUsedOffset = 93, HeroCountOffset = 97, HeroesOffset = 101, HeroSize = 5420;
    const int UnitCountOffset = 5_842_261, UnitsOffset = 5_842_265, UnitSize = 230;
    const int MaxKinds = 999;
    const uint FileMapWrite=0x0002;
    readonly IntPtr mapping, view;
    ObserverMemory(IntPtr mapping, IntPtr view) { this.mapping=mapping;this.view=view; }
    public static ObserverMemory? TryOpen()
    {
        var mapping=OpenFileMapping(FileMapWrite,false,MappingName); if(mapping==IntPtr.Zero)return null;
        var view=MapViewOfFile(mapping,FileMapWrite,0,0,UIntPtr.Zero); if(view==IntPtr.Zero){CloseHandle(mapping);return null;}
        return new ObserverMemory(mapping,view);
    }
    public void SetRefreshRate(int milliseconds) => Marshal.WriteInt32(view,4,milliseconds);
    public LiveSnapshot? ReadStable()
    {
        LiveSnapshot? previous=null;
        for(var attempt=0;attempt<4;attempt++)
        {
            var current=Read();
            if(previous is not null && current.Fingerprint()==previous.Fingerprint())return current;
            previous=current;Thread.Sleep(25);
        }
        return null;
    }
    LiveSnapshot Read()
    {
        var game=IntPtr.Add(view,GameOffset);var inGame=Marshal.ReadByte(game,0)!=0;
        var time=(uint)Marshal.ReadInt32(game,1);var mapName=ReadString(game,262,256);
        var players=new List<LivePlayer>();var units=new List<LiveUnit>();
        for(var slot=0;slot<MaxPlayers;slot++)
        {
            var p=IntPtr.Add(view,PlayersOffset+slot*PlayerSize);
            if(Marshal.ReadByte(p,PlayerTypeOffset)!=1 || Marshal.ReadByte(p,SlotStateOffset)!=1)continue;
            var playerId=Marshal.ReadByte(p,PlayerIdOffset);var name=ReadString(p,0,36);
            var traitPoints=ReadUInt(p,FoodUsedOffset);players.Add(new(playerId,name,traitPoints));
            var counts=new Dictionary<string,int>(StringComparer.Ordinal);
            var heroCount=Math.Min(ReadUInt(p,HeroCountOffset),MaxKinds);
            for(var i=0u;i<heroCount;i++){var id=ReadUInt(p,HeroesOffset+(int)i*HeroSize);Add(counts,FourCC(id),1);}
            var unitCount=Math.Min(ReadUInt(p,UnitCountOffset),MaxKinds);
            for(var i=0u;i<unitCount;i++)
            {
                var u=IntPtr.Add(p,UnitsOffset+(int)i*UnitSize);var id=ReadUInt(u,0);var alive=ReadUInt(u,108);
                if(alive>0)Add(counts,FourCC(id),(int)Math.Min(alive,100000));
            }
            units.AddRange(counts.Where(x=>IsFourCC(x.Key)).Select(x=>new LiveUnit(playerId,x.Key,x.Value)));
        }
        return new(inGame,time,mapName,players,units);
    }
    static void Add(Dictionary<string,int> counts,string id,int count){if(IsFourCC(id))counts[id]=counts.GetValueOrDefault(id)+count;}
    static bool IsFourCC(string id)=>id.Length==4&&id.All(c=>c is >= ' ' and <= '~');
    static string FourCC(uint id)=>new(new[]{(char)(id>>24),(char)(id>>16),(char)(id>>8),(char)id});
    static uint ReadUInt(IntPtr p,int offset)=>unchecked((uint)Marshal.ReadInt32(p,offset));
    static string ReadString(IntPtr p,int offset,int length){var bytes=new byte[length];Marshal.Copy(IntPtr.Add(p,offset),bytes,0,length);var end=Array.IndexOf(bytes,(byte)0);return Encoding.UTF8.GetString(bytes,0,end<0?length:end);}
    public void Dispose(){UnmapViewOfFile(view);CloseHandle(mapping);}
    [DllImport("kernel32.dll",SetLastError=true,CharSet=CharSet.Unicode)]static extern IntPtr OpenFileMapping(uint access,bool inherit,string name);
    [DllImport("kernel32.dll",SetLastError=true)]static extern IntPtr MapViewOfFile(IntPtr mapping,uint access,uint high,uint low,UIntPtr bytes);
    [DllImport("kernel32.dll")]static extern bool UnmapViewOfFile(IntPtr address);
    [DllImport("kernel32.dll")]static extern bool CloseHandle(IntPtr handle);
}

record LivePlayer(int playerId,string name,uint traitPoints);
record LiveUnit(int playerId,string typeId,int count);
record LiveSnapshot(bool InGame,uint GameTimeMs,string MapName,List<LivePlayer> Players,List<LiveUnit> Units)
{
    public string Fingerprint()=>JsonSerializer.Serialize(new{InGame,GameTimeMs,MapName,Players,Units});
}
