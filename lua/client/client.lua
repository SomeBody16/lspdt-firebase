-- ##################### OWN IMPLEMENTATION

--[[
  Check if player is admin
  @param source: number - Player id

  @return boolean
]]--
function PlayerIsAdmin()
    return true
end

--[[
  Check if player can open tablet (ex. is admin or policeman)
  @param source: number - Player id

  @return boolean
]]--
function PlayerCanOpenTablet()
    return PlayerIsAdmin() or true
end

--[[
  Get closest id of player (this will be used in server as target in 'LSPDT:Arrest' and 'LSPDT:Mandate')

  @return number
]]--
function ClosestId()
    return 17
end

--[[
  Player starts voice talking
  @param source: number - Player id
]]
AddEventHandler('LSPDT:StartTalking', function(source)
  TriggerEvent('chat:addMessage', {
    color = { 0, 255, 255},
    args = {"[TALK]", 'Start talk'}
  })
end)

--[[
  Player stop voice talking
  @param source: number - Player id
]]
AddEventHandler('LSPDT:StopTalking', function(source)
  TriggerEvent('chat:addMessage', {
    color = { 0, 255, 255},
    args = {"[TALK]", 'Stop talk'}
  })
end)


--[[
  Read player unique character id
  @param source: number - PlayerId

  @return number
]]--
function PlayerUniqueId(source)
  return 16
end



-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- Client
AddEventHandler('LSPDT:ClosestId', function()
  TriggerEvent('LSPDT:NUIEvent', 'LSPDT:ClosestId', ClosestId())
end)

RegisterNetEvent("LSPDT:NUIEvent")
AddEventHandler("LSPDT:NUIEvent", function(name, data)
    SendNUIMessage({
        eventName = name,
        eventData = data
    })
end)

AddEventHandler("LSPDT:Hide", function(fromNUI)
    ToggleTablet(false)
    if not fromNUI then
      TriggerEvent("LSPDT:NUIEvent", "LSPDT:Hide")
    end
    SetNuiFocus(false, false)
end)

AddEventHandler("LSPDT:Show", function(name, data)
    ToggleTablet(true)
    TriggerEvent("LSPDT:NUIEvent", "LSPDT:Show")
    SetNuiFocus(true, true)
end)

AddEventHandler('onClientResourceStart', function (resourceName)
  if(GetCurrentResourceName() ~= resourceName or resourceName ~= 'lspdt') then
    return
  end


  -- If player can open tablet, register commands
  if PlayerCanOpenTablet() then

    -- If support, can set his citizen to be a chief (full access to tablet)
    if PlayerIsAdmin() then
      RegisterCommand('lspdt_im_chief', function()
        TriggerServerEvent('LSPDT:ImChief')
      end)
      TriggerEvent('chat:addSuggestion', '/lspdt_im_chief', 'Make you chief of police')
    end


  end


  -- DEBUG
  Citizen.Wait(500)
  TriggerEvent('LSPDT:Show')
end)

RegisterCommand('lspdt', function()
  -- If policeman or support, can open tablet
  if PlayerCanOpenTablet() then
    TriggerEvent("LSPDT:Show")
  end
end)
TriggerEvent('chat:addSuggestion', '/lspdt', 'Open LSPD Tablet')

RegisterNUICallback('LSPDT_TriggerEvent', function(data, cb)
  if PlayerCanOpenTablet() then
    TriggerEvent(data.eventName, data.eventData)
    TriggerServerEvent('LSPDT:TriggerServerEvent', data.eventName, data.eventData)
    cb(0)
  end
end)


-- -- -- -- -- -- -- -- -- Tablet Animation
local tablet = false
local tabletDict = "amb@code_human_in_bus_passenger_idles@female@tablet@base"
local tabletAnim = "base"
local tabletProp = `prop_cs_tablet`
local tabletBone = 60309
local tabletOffset = vector3(0.03, 0.002, -0.0)
local tabletRot = vector3(10.0, 160.0, 0.0)

function ToggleTablet(toggle)
    if toggle and not tablet then
        tablet = true

        Citizen.CreateThread(function()
        RequestAnimDict(tabletDict)

        while not HasAnimDictLoaded(tabletDict) do
            Citizen.Wait(150)
        end

        RequestModel(tabletProp)

        while not HasModelLoaded(tabletProp) do
            Citizen.Wait(150)
        end

        local playerPed = PlayerPedId()
        local tabletObj = CreateObject(tabletProp, 0.0, 0.0, 0.0, true, true, false)
        local tabletBoneIndex = GetPedBoneIndex(playerPed, tabletBone)

        SetCurrentPedWeapon(playerPed, `weapon_unarmed`, true)
        AttachEntityToEntity(tabletObj, playerPed, tabletBoneIndex, tabletOffset.x, tabletOffset.y, tabletOffset.z, tabletRot.x, tabletRot.y, tabletRot.z, true, false, false, false, 2, true)
        SetModelAsNoLongerNeeded(tabletProp)

        while tablet do
            Citizen.Wait(100)
            playerPed = PlayerPedId()

            if not IsEntityPlayingAnim(playerPed, tabletDict, tabletAnim, 3) then
                TaskPlayAnim(playerPed, tabletDict, tabletAnim, 3.0, 3.0, -1, 49, 0, 0, 0, 0)
            end
        end

        ClearPedSecondaryTask(playerPed)

        Citizen.Wait(450)

        DetachEntity(tabletObj, true, false)
        DeleteEntity(tabletObj)
    end)
    elseif not toggle and tablet then
        tablet = false
    end
end
