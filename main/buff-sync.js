export function Collect(item, index) {

    const ClassN = [`s${index}`, `m${index}`, `h${index}`, `d${index}`]
    const items = [];
    items[0] = item.atkSpeedBuff;
    items[1] = item.manaRegen;
    items[2] = item.healthRegen;
    items[3] = item.slow;

    for(let i=0;i<=3;i++)
    {
        if(items[i] != 0)
        {
            if(document.getElementById("container2") !== null)
            {
                document.getElementsByClassName(ClassN[i])[1].checked = item.Check;
            }
            document.getElementsByClassName(ClassN[i])[0].checked = item.Check;
        }
    }

}
