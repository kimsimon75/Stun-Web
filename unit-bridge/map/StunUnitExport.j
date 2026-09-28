// Paste globals into the map globals block, functions into map custom script.
// Call StunUnitExportInit(0) ON ALL CLIENTS at map initialization.
// Parameter 0 selects Player(0)'s PC as the single file writer.
// Only use in the matching ORDR 2.322 map. No AWS/Netlify token in map code.
globals
    group STUN_ExportGroup = null
    rect STUN_ExportBounds = null
    timer STUN_ExportTimer = null
    integer STUN_ExportPlayer = 0
    integer STUN_ExportSequence = 0
    string STUN_ExportSession = ""
    integer STUN_ExportPartIndex = 0
    boolean STUN_ExportLast = false
    string STUN_ExportItems = ""
endglobals

function StunExportEscape takes string value returns string
    local integer i = 0
    local string result = ""
    local string c
    loop
        exitwhen i >= StringLength(value)
        set c = SubString(value, i, i + 1)
        if c == "\\" then
            set result = result + "\\\\"
        elseif c == "\"" then
            set result = result + "\\\""
        else
            set result = result + c
        endif
        set i = i + 1
    endloop
    return result
endfunction

function StunExportWrite takes nothing returns nothing
    local string ending = "false"
    local string body
    local string request
    if STUN_ExportLast then
        set ending = "true"
    endif
    set body = "{\"protocol\":\"stun-units-v1\",\"mapVersion\":\"2.322\",\"session\":\"" + STUN_ExportSession + "\",\"snapshot\":" + I2S(STUN_ExportSequence) + ",\"part\":" + I2S(STUN_ExportPartIndex) + ",\"final\":" + ending + ",\"units\":[" + STUN_ExportItems + "]}"
    set request = "{\"url\":\"https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots\",\"method\":\"POST\",\"noResponse\":true,\"body\":\"" + StunExportEscape(body) + "\"}"
    if GetLocalPlayer() == Player(STUN_ExportPlayer) then
        call PreloadGenClear()
        call PreloadGenStart()
        call Preload(request)
        call PreloadGenEnd("networkio\\requests\\stun-units-" + I2S(STUN_ExportPartIndex) + ".txt")
    endif
endfunction

function StunExportPart takes integer part, boolean last, string units returns nothing
    set STUN_ExportPartIndex = part
    set STUN_ExportLast = last
    set STUN_ExportItems = units
    // Give each escaping/write batch its own JASS operation budget.
    call ExecuteFunc("StunExportWrite")
endfunction

function StunUnitExportTick takes nothing returns nothing
    local unit u
    local integer count = 0
    local integer total = 0
    local integer part = 0
    local string items = ""
    set STUN_ExportSequence = STUN_ExportSequence + 1
    // Enumerate and manage handles identically on all clients; only file IO is local.
    call GroupEnumUnitsInRect(STUN_ExportGroup, STUN_ExportBounds, null)
    loop
        set u = FirstOfGroup(STUN_ExportGroup)
        exitwhen u == null
        call GroupRemoveUnit(STUN_ExportGroup, u)
        if GetUnitTypeId(u) != 0 and not IsUnitType(u, UNIT_TYPE_DEAD) then
            set total = total + 1
            // Do not publish a misleading truncated snapshot.
            if total > 4096 then
                call GroupClear(STUN_ExportGroup)
                set u = null
                return
            endif
            if count > 0 then
                set items = items + ","
            endif
            set items = items + "{\"instanceId\":\"" + I2S(GetHandleId(u)) + "\",\"typeId\":" + I2S(GetUnitTypeId(u)) + ",\"playerId\":" + I2S(GetPlayerId(GetOwningPlayer(u))) + "}"
            set count = count + 1
            if count == 8 then
                call StunExportPart(part, false, items)
                set part = part + 1
                set items = ""
                set count = 0
            endif
        endif
    endloop
    call StunExportPart(part, true, items)
    set u = null
endfunction

function StunUnitExportInit takes integer writerPlayerId returns nothing
    if STUN_ExportTimer != null or writerPlayerId < 0 or writerPlayerId > 27 then
        return
    endif
    set STUN_ExportPlayer = writerPlayerId
    set STUN_ExportSession = I2S(GetRandomInt(1, 2147483646)) + "-" + I2S(GetRandomInt(1, 2147483646))
    set STUN_ExportGroup = CreateGroup()
    set STUN_ExportBounds = GetWorldBounds()
    set STUN_ExportTimer = CreateTimer()
    call TimerStart(STUN_ExportTimer, 3.00, true, function StunUnitExportTick)
endfunction
