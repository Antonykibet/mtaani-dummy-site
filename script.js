function generateRandomNumb() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateSiteId(){
    let domainName=window.location.hostname
    return `${domainName}:${generateRandomNumb()}`
}
function getSiteId(){
    let siteId = localStorage.getItem('siteId')
    if(!siteId){
        localStorage.setItem('siteId',generateSiteId())
        return localStorage.getItem('siteId')
    }
    return siteId
}
async function getAgents(){
    let response = await fetch(`http://146.190.155.200:3500/api/agents?siteId=${getSiteId()}`)
    return await response.json()
}
async function getPickupMtaaniCost(){
    let response = await fetch(`http://146.190.155.200:3500/api/getConfig?siteId=${getSiteId()}`)
    let {price,isOn} = await response.json()
    if(!isOn){
        price=0
    }
    return price
}


function agentOptionsRender(div,agents){
    div.innerHTML=''
    agents.forEach((item) => {
        let agentDiv = document.createElement('div');
        agentDiv.style.cssText = 'display:flex;flex-direction:column;'
        let labelDropdown = document.createElement('div');
        labelDropdown.textContent = `${item.location}`;
        labelDropdown.innerHTML+=`<i style='margin-left:24px;' class="bi bi-caret-down-fill"></i>`
        labelDropdown.style.cssText='margin-top:8px;display:flex;justify-content:space-between;'
        agentDiv.append(labelDropdown);
        labelDropdown.addEventListener('click', function() {
            // Remove any existing select elements
            let existingSelect = document.querySelector('.mtaaniSelect');
            if (existingSelect) {
                existingSelect.remove()
            }
            // Create a new select element
            let selectElem = document.createElement('select');
            selectElem.classList.add('mtaaniSelect')
            //selectElem.style.cssText='width:50%;'
            selectElem.setAttribute('name', 'location');
            item.agents.forEach((agent) => {
                selectElem.innerHTML += `<option value='${item.location}:${agent}'>${agent}</option>`;
            });
            agentDiv.appendChild(selectElem);
        });
        div.append(agentDiv);
    });
}
window.pickUpMtaaniOption = async function(selectElem,div,priceDiv=null) {
    let agents = await getAgents()
    if(agents==''){
        return
    }
    if(priceDiv!=null){
        priceDiv.innerText=await getPickupMtaaniCost()
    }
    let mtaaniOption =document.createElement('option')
    mtaaniOption.value='pickupMtaani'
    mtaaniOption.innerText='Pick up Mtaani'
    selectElem.appendChild(mtaaniOption)
    selectElem.addEventListener('change', function() {
        if (this.value === 'pickupMtaani') {
            agentOptionsRender(div,agents); 
        }else{
            div.innerHTML=''
        }
    }); 
}
