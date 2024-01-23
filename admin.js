let siteConfig=null
function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
function generateSiteId(){
    let domainName=window.location.hostname
    return `${domainName}:${generateId()}`
}
function getSiteId(){
    let siteId = localStorage.getItem('siteId')
    if(!siteId){
        localStorage.setItem('siteId',generateSiteId())
        return localStorage.getItem('siteId')
    }
    return siteId
}
async function getSiteConfig(){
    let response = await fetch(`https://n3vj0vz2-3500.uks1.devtunnels.ms/api/getConfig?siteId=${getSiteId()}`)
    return await response.json()
}
getSiteConfig().then((result)=>{
    siteConfig = result
})

async function renderHtml(){
    let agents = await getAgents()
    let modalBackground = document.createElement('div')
    modalBackground.style.cssText='position:fixed;display:flex;justify-content:center;align-items:center;top: 0px;bottom: 0px;width: 100vw;background-color: rgba(26, 26, 26, 0.61);backdrop-filter: blur(1px);'
    let modal =  document.createElement('div')
    modal.style.cssText='background-color:white;padding:24px;'
    modal.innerHTML=`
        <form action='https://n3vj0vz2-3500.uks1.devtunnels.ms/api/config?siteId=${getSiteId()}' method='post'>
            <div>
                <label>Work with Pickup Mtaani:</label>
                <input id='availability' name='available' type='checkbox'>
            </div>
            <div id='dropOffpointDiv'>
                <h3  >Select drop off point:</h3>
                <div id='pickupMtaaniAgents'></div>
            </div>
            <button type='submit'>Submit</button>
        </form>
    `
    modalBackground.appendChild(modal)
    document.body.appendChild(modalBackground)

    let availabilityCheckbox =document.getElementById('availability')
    let pickupMtaaniAgents = document.getElementById('pickupMtaaniAgents')
    let dropOffpointDiv = modal.querySelector('#dropOffpointDiv')
    if(siteConfig.isOn){
        availabilityCheckbox.checked=true
        agentOptionsRender(pickupMtaaniAgents,agents)
    }
    if(!siteConfig.isOn){
        dropOffpointDiv.style.display='none'
    }
    availabilityCheckbox.addEventListener('click',async(event)=>{
        if(event.target.checked == true){
            await fetch(`https://n3vj0vz2-3500.uks1.devtunnels.ms/api/toggleAvailability?siteId=${getSiteId()}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    available: true
                }),
            })
            
            dropOffpointDiv.style.display='flex'
            agentOptionsRender(pickupMtaaniAgents,await getAgents())
        }else{
            dropOffpointDiv.style.display='none'
        }
    })
}