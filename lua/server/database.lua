AddEventHandler('LSPDT:InitDatabase', function(cb)
  MySQL.ready(function()
    cb()
  end)
end)
