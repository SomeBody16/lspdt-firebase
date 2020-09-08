-- ##################### OWN IMPLEMENTATION

--[[
  Show message like /me command
  @param source: number - Player id
  @param msg: string - Message
]]--
AddEventHandler("LSPDT:ActionMe", function(source, msg)
  TriggerClientEvent('chat:addMessage', -1, {
    color = { 255, 0, 0},
    args = {"[ME]", msg}
  })
end)

--[[
  Show message like /do command
  @param source: number - Player id
  @param msg: string - Message
]]--
AddEventHandler("LSPDT:ActionDo", function(source, msg)
  TriggerClientEvent('chat:addMessage', -1, {
    color = { 0, 0, 255},
    args = {"[DO]", msg}
  })
end)

--[[
  Arrest citizen
  @param source: number - Player id
  @param eventData: {
    target: number - Target player id
    value: number - Sum of penalties (time) sent from tablet
    reason: string - Reason of arrest
  }
]]
AddEventHandler('LSPDT:Arrest', function(source, eventData)
  TriggerClientEvent('chat:addMessage', -1, {
    color = { 0, 255, 0},
    args = {"[ARREST]", eventData.target .. ' | ' .. eventData.value .. ' | ' .. eventData.reason}
  })
end)

--[[
  Send mandate to citizen
  @param source: number - Player id
  @param eventData: {
    target: number - Target player id
    value: number - Sum of penalties (money) sent from tablet
    reason: string - Reason of mandate
  }
]]
AddEventHandler('LSPDT:Mandate', function(source, eventData)
  TriggerClientEvent('chat:addMessage', -1, {
    color = { 0, 255, 0},
    args = {"[MANDATE]", eventData.target .. ' | ' .. eventData.value .. ' | ' .. eventData.reason}
  })
end)

--[[
  Check if player is admin
  @param source: number - Player id

  @return boolean
]]--
function PlayerIsAdmin(source)
  return true
end

--[[
  Check if player can open tablet (ex. is admin or policeman)
  @param source: number - Player id

  @return boolean
]]--
function PlayerCanOpenTablet(source)
  return PlayerIsAdmin(source) or true
end

--[[
  Read player unique character id
  @param source: number - PlayerId

  @return number
]]--
function PlayerUniqueId(source)
  return 16
end

--[[
  Read player character name
  @param source: number - Player id

  @return string
]]--
function PlayerName(source)
  return 'Samuel'
end

--[[
  Read player character surname
  @param source: number - Player id

  @return string
]]--
function PlayerSurname(source)
  return 'Buddy'
end

--[[
  Read player character birth date
  @param source: number - Player id

  @return string
]]--
function PlayerBirthDate(source)
  return '06-01-2000'
end


--[[
  Read vehicle owner unique character id OR organization name or -1 if not found
  @param plate: string - Vehicle plate

  @return number | string | -1
]]--
function VehicleOwnerId(plate)
  local results = {1, 2, 3, 'police2', 'redneck0', 'ballas1', 'm1', 'm2'}
  return results[ math.random(#results) ]
end

--[[
  Read vehicle location
  @param plate: string - Vehicle plate

  @return number | string | -1
]]--
function VehicleLocation(plate)
  local results = {'???', 'Autocasco', 'LSPD_PARK', 'San Andreas Ave', 'Paleto Bay'}
  return results[ math.random(#results) ]
end

-- ################################################################## Config
FIREBASE_FUNCTIONS = 'http://localhost:5001/fivem-lspdt/us-central1/'




-- ################################################################## Events

AddEventHandler('onResourceStart', function(resourceName)
  if GetCurrentResourceName() ~= resourceName then
    return
  end
  if resourceName ~= 'lspdt' then
    print('Resource name MUST be equal to "lspdt" | Current: ' .. resourceName)
  end

  print('Los Santos Police Department Tablet has been started on the server.')
end)

AddEventHandler("playerConnecting", function(name, setKickReason, deferrals)
  -- Maybe call this when player info is ready, not on every connection
  TriggerEvent('LSPDT:CreateCitizen')
end)



AddEventHandler('LSPDT:CreateCitizen', function(source, eventData)
  callFirebaseFunction('createCitizen', {
    uid = PlayerUniqueId(source),
    name = PlayerName(source),
    surname = PlayerSurname(source),
    birthDate = PlayerBirthDate(source)
  })
end)

RegisterNetEvent('LSPDT:ImChief')
AddEventHandler('LSPDT:ImChief', function(source, eventData)
  if not PlayerIsAdmin() then return end
  callFirebaseFunction('imChief', {
    uid = PlayerUniqueId(source)
  })
end)

-- ################################################################## Functions


function callFirebaseFunction(name, data)
  PerformHttpRequest(
    FIREBASE_FUNCTIONS .. name,
    nil,
    'GET',
    json.encode(data),
    { ['Content-Type'] = 'application/json' }
  )
end
