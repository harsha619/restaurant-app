let tables={
    0:{name:"Table1",items:{},noItems:0,totalAmount:0 },
    1:{name:"Table2",items:{},noItems:0,totalAmount:0 },
    2:{name:"Table3",items:{},noItems:0,totalAmount:0 },
    3:{name:"Table4",items:{},noItems:0,totalAmount:0 }
    
}

let items={
    0:{ name:"Biryani"        , cost:290, category:"nonveg", type:"main course",noItems:1 },
    1:{ name:"Chicken65"      , cost:250, category:"nonveg", type:"starters" ,noItems:1 },
    2:{ name:"Butter chicken" , cost:260, category:"nonveg", type:"curry",noItems:1 },
    3:{ name:"Item4"          , cost:111, category:"veg"   , type:"starters",noItems:1 },
    4:{ name:"Chicken Tandori"        , cost:320, category:"nonveg", type:"starters",noItems:1 },
    5:{ name:"Veg Noodles"        , cost:100, category:"veg", type:"chinees",noItems:1 },
    6:{ name:"ChickenFried Rice"        , cost:180, category:"nonveg", type:"chinees",noItems:1 },
    7:{ name:"Panner"        , cost:180, category:"veg", type:"curry",noItems:1 },
    8:{ name:"Fish Curry "        , cost:290, category:"nonveg", type:"curry",noItems:1 },
    9:{ name:"Garlic Mushroom"        , cost:240, category:"veg", type:"curry",noItems:1 }
} 

let a

if(sessionStorage.getItem("data")!==null)
tables=JSON.parse(sessionStorage.getItem("data"))
const addSession=()=>{
    return sessionStorage.setItem("data",JSON.stringify(tables))
}

let popUp=document.getElementById("pop-up")
    popUp.style.display="none"



const saveChanges=(e,tableNo)=>{
    let popRemove=document.getElementById("pop-remove")
    popRemove.removeAttribute("style")
    let amount=0
    let count=0
    let presentTbl=tables[tableNo]
    if(presentTbl.items)
    for (let i in presentTbl.items ){
        let inpId=document.getElementById(`bill-${presentTbl.name}-${items[i].name}-inp`);
        inpId=parseInt(inpId.value)
        count+=inpId
        presentTbl.items[parseInt(i)].noItems=inpId
        amount+=inpId*items[i].cost
        
    }
    presentTbl.totalAmount=amount
    presentTbl.noItems=count
    let tableSpanCost=document.getElementById(`${presentTbl.name}-span-cost`)
    let tableSpanitems=document.getElementById(`${presentTbl.name}-span-noItems`)
        tableSpanCost.innerHTML="amount:"+presentTbl.totalAmount
        tableSpanitems.innerHTML="items:"+count

        addSession()
    
}
const  billItemInpClick=(e,tableNo,itmNo)=>{
    let popRemove=document.getElementById("pop-remove")
    popRemove.style.display="none"
    let amount=0
    
    for (let i in tables[tableNo].items ){
        if(i===itmNo && (e.target.value.length)>0)
        amount+=parseInt(e.target.value)*tables[tableNo].items[i].cost
        else
        amount+=tables[tableNo].items[i].cost*tables[tableNo].items[i].noItems;
    }
    let amountDiv=document.getElementById("bill-amount")
   
        amountDiv.innerHTML=amount
        
    tables[tableNo].totalAmount=amount
    

}

const deletItem=(event,itemNo,tableNo)=>{
    let allTables=tables[tableNo]
    let tblName=allTables.name
    let prevNoItems=allTables.items[itemNo].noItems
    let itemCost=allTables.items[itemNo].cost

    allTables.noItems-=prevNoItems
    allTables.totalAmount-=prevNoItems*itemCost
    
    items[itemNo].noItems=1
    delete(allTables.items[itemNo])
    let tableSpanCost=document.getElementById(`${tblName}-span-cost`)
    let tableSpanitems=document.getElementById(`${tblName}-span-noItems`)
    tableSpanCost.innerHTML="amount:"+allTables.totalAmount
    tableSpanitems.innerHTML="items"+allTables.noItems
    
    let amount=document.getElementById("bill-amount")
    amount.innerHTML=allTables.totalAmount
    createBill(tableNo)
    addSession()
}

const addItemsToBill=(tr,temp,item,tableNo)=>{
    for ( let i in temp){
        let td=document.createElement("td")
        let tablename=tables[tableNo].name
        let itemName=tables[tableNo].items[item].name  ;
        tr.setAttribute("id",`${tablename}-${itemName}-bill`)
        if(i==="3"){
            let inpItems=document.createElement("input")
            inpItems.setAttribute("type","number")
            inpItems.setAttribute("min","1")
            inpItems.setAttribute("id",`bill-${tablename}-${itemName}-inp`)
            inpItems.setAttribute("value",temp[i])
            inpItems.addEventListener("input",(e)=>{
                billItemInpClick(e,tableNo,item)
            })
            td.appendChild(inpItems)
        }
        else if(i==="4")
        {
            let inpItems=document.createElement("input")
            let ii=document.createElement("i")
            //delete logo
            ii.setAttribute("class","fa-solid fa-trash")
            inpItems.setAttribute("type","button")
            ii.addEventListener("click",(event)=>{
                deletItem(event,item,tableNo)
            })
           
            td.appendChild(ii)
        }
        else
        td.innerHTML=temp[i]
        
        tr.appendChild(td)

    }
    return tr
}

const createBill=(tableNo)=>{
    let finalBill=document.getElementById("finall-bill")
    finalBill.addEventListener ("click",()=>{
        let a=confirm(`Total bill is ${tables[tableNo].totalAmount}`)
        if(a){
        popUp.style.display="none"
        popBg.classList.remove("pop-bg")
        }
        console.log(a);
    })
    let popBg=document.getElementById("pop-bg")
    popBg.classList.add("pop-bg")

    let saveDiv=document.getElementById("save-changes")

    saveDiv.addEventListener("click",(event)=>{
        saveChanges(event,tableNo)
    })

 
    let popUp=document.getElementById("pop-up")
    popUp.removeAttribute("style")
    popUp.classList.add("pop-div")
    
    let table=document.getElementById("tbody")
    let popRemove=document.getElementById("pop-remove")
    let billTableNo=document.getElementById("bill-table-name")
    billTableNo.innerHTML=tables[tableNo].name

    popRemove.addEventListener("click",(e)=>{
        popUp.style.display="none"
        popUp.classList.remove("pop-div")
        popBg.classList.remove("pop-bg")
    })
    // removeBillItems
    while(table.hasChildNodes()){
        table.removeChild(table.lastChild)
    }
    
    //adding items to the bill items
    c=0
    for (let item in  tables[tableNo].items){
        c+=1
        let presentItem=tables[tableNo].items
        let tr=document.createElement("tr")
        let temp=[c,presentItem[item].name,presentItem[item].cost,presentItem[item].noItems,"d"]
        
        tr=addItemsToBill(tr,temp,item,tableNo)
        table.appendChild(tr)
        let amount=document.getElementById("bill-amount")
        amount.innerHTML=tables[tableNo].totalAmount

    }
    
}

const getBill=(a)=>{
    createBill(a)
}


function allowDrop(ev,tableNo) {

    let tblh1=document.getElementById(`${tables[tableNo].name}-div`)
    tblh1.style.backgroundColor="green"
    
    ev.preventDefault();
  }
  const dropBg=()=>{
    for (let t in tables){
        let tblh1=document.getElementById(`${tables[t].name}-div`)
        tblh1.style.backgroundColor="#28355a"
        }
  }
  
  function drop(event,tableNo) {
    
    dropBg() //bring back to original  background from green to blue 

    let tableName=tables[tableNo].name
    let span=document.getElementById(tableName+"-span-cost")
    let spanNoItems=document.getElementById(tableName+"-span-noItems")

    let itemId = event.dataTransfer.getData("data");

    let tempItems=tables[tableNo];
    if(tempItems["items"][itemId]){
    tempItems["items"][itemId].noItems+=1
    }
    //adding items to the object 
    tempItems["items"]={[itemId]:items[itemId],...tempItems["items"]}
    
    tempItems["noItems"]+=1
    tempItems["totalAmount"]+=tempItems["items"][itemId].cost
    
    span.innerHTML="amount: "+tables[tableNo].totalAmount
    spanNoItems.innerHTML="items: "+tables[tableNo].noItems
    
    addSession()
    event.preventDefault();

  }
const dragStart=(event,id)=>{
    event.dataTransfer.setData("data", id);
}

const createTables=()=>{
    
    let tableDiv=document.getElementById("table")
    let c=0
    for (let tableNo in tables){
        tableName=tables[tableNo].name
        let crtDiv=document.createElement("div")
        let h1=document.createElement("h1")
        let inp=document.createElement("input")
        let span=document.createElement("span")
        let spanNoItems=document.createElement("span")
        //div
    
        crtDiv.setAttribute("class","table-div")
        crtDiv.setAttribute("id", tableName+"-div")
        crtDiv.setAttribute("ondrop",`drop(event,${c})` )  
        crtDiv.setAttribute("key", tableName) 
        crtDiv.setAttribute("ondragover",`allowDrop(event,${tableNo})`) 
        span.setAttribute("id", tableName+"-span-cost")
        spanNoItems.setAttribute("id",tableName+"-span-noItems") 
        //h1 
        h1.setAttribute("id",tableName+"-h1")
        inp.setAttribute("type","button")
        inp.setAttribute("value",tableName)
        inp.setAttribute("id",tableName+"-inp")


        inp.addEventListener("click", ()=>{
            getBill(tableName)
        })
        crtDiv.addEventListener("click",()=>{
            
            getBill(tableNo)
        })
        
        crtDiv.appendChild(h1)
        crtDiv.appendChild(span)
        crtDiv.appendChild(spanNoItems)
        tableDiv.appendChild(crtDiv)
        //innerhtml
        span.innerHTML="amount: "+tables[tableNo].totalAmount
        spanNoItems.innerHTML="items: "+tables[tableNo].noItems
        h1.innerHTML=tableName 
        c+=1
    }
    
}




const createItems=()=>{
    
    let itemDiv=document.getElementById("items")
    for (let item in items){
        let name=items[item].name
        let crtDiv=document.createElement("div")
        let nameCostDiv=document.createElement("div")
        let nameDiv=document.createElement("div")
        let costDiv =document.createElement("div")
        let typeCatDiv=document.createElement("div")
        let spanType=document.createElement("span")
        let imgCat=document.createElement("img")
        let spanCat=document.createElement("span")
        let spanCatt=document.createElement("span")
        //attributes 
        crtDiv.setAttribute("draggable","true")
        crtDiv.setAttribute("ondragstart",`dragStart(event,${item})`)
        crtDiv.setAttribute("id",name+"-div")
        crtDiv.setAttribute("class","item-div ")
        nameCostDiv.setAttribute("id","name-cost-div "+name)
        nameDiv.setAttribute("id","item-name")
        costDiv.setAttribute("id","item-cost")
        typeCatDiv.setAttribute("id","type-cat-div "+ name)
        spanType.setAttribute("class","type")
        spanType.setAttribute("class",name+"-type")
        spanCatt.setAttribute("id","type")
        if(items[item].category==="veg")
        imgCat.setAttribute("src","./images/veg.png")
        else
        imgCat.setAttribute("src","./images/non-veg.png")
        imgCat.setAttribute("id","img-cat")

        spanCat.setAttribute("id",name+"-cat")
       spanCat.setAttribute("class","span-cat")
        //values
        nameDiv.innerHTML=name 
        costDiv.innerHTML=items[item].cost
        spanType.innerHTML="#"+items[item].type
        spanCatt.innerHTML=items[item].category

        //appendchilds
        nameCostDiv.appendChild(nameDiv)
        nameCostDiv.appendChild(costDiv)
        crtDiv.appendChild(nameCostDiv)
        spanCat.appendChild(spanCatt)
        spanCat.appendChild(imgCat)
        typeCatDiv.appendChild(spanType)
        typeCatDiv.appendChild(spanCat)
        crtDiv.appendChild(typeCatDiv)
        itemDiv.appendChild(crtDiv)
        
    }

}

createTables() 
createItems()


//searching the values


const tableSearch=(e)=>{
    search(e.target.value,tables)
}
const itemSearch=(e)=>{
    search(e.target.value,items)
}
const inputFunction=()=>{
    let tableInp=document.getElementById("table-search")
    tableInp.addEventListener("input",tableSearch)
    let itemInp=document.getElementById("items-search")
    itemInp.addEventListener("input",itemSearch)
}
inputFunction()
const search=(value,tables)=>{
    for (let val in tables ){
        let id=document.getElementById(tables[val].name+"-div")
        id.removeAttribute("style")
    } 
    if(value.length!==0)
    for (let val in tables ){
        let regex=new RegExp(value,"i") 
        
        if(!regex.test(tables[val].name)  && !regex.test(tables[val].type))
        {
            let id=document.getElementById(tables[val].name+"-div")
            id.style.display="none"
        }

    }
}