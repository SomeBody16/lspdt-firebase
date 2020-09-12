-- ##################### OWN IMPLEMENTATION

--[[
  Read player unique character id
  @param source: number - PlayerId

  @return number
]]--
function PlayerUniqueId(source)
  return 166
end

--[[
  Read player character name
  @param source: number - Player id

  @return string
]]--
function PlayerName(source)
  return 'Kasjusz'
end

--[[
  Read player character surname
  @param source: number - Player id

  @return string
]]--
function PlayerSurname(source)
  return 'Manhill'
end

--[[
  Read player character birth date
  @param source: number - Player id

  @return string
]]--
function PlayerBirthDate(source)
  return '06-01-2000'
end


-- ################################################################## Config
PASSWORD = 'MFqHvp49M7Ye7GBRkK9wWa8RHze2ekpy8EcKuRuhL2QSuJySW4bDDERhpFMZsP9w'
-- ################################################################## Events

AddEventHandler('LSPDT:CreateCitizen', function(source, eventData)
    PerformHttpRequest(
        'https://us-central1-fivem-lspdt.cloudfunctions.net/createCitizen',
        nil,
        'POST',
        json.encode({
        uid = tostring(PlayerUniqueId(source)),
        citizen = {
            Name = PlayerName(source),
            Surname = PlayerSurname(source),
            BirthDate = PlayerBirthDate(source)
        },
        password = PASSWORD
    }),
        { ['Content-Type'] = 'application/json' }
    )
end)
