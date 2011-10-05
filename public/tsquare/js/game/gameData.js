var missionData = 
  {"data":[[],[
  {
      "name": "ambulance",
      "category": 'protection',
      "index": 0,
      "lane": 1,
      "x": 4,
      "order": 1
  },
   {
     "name": "ambulance",
     "category": 'protection',
     "index": 0,
     "lane": 1,
     "x": 5,
     "order": 1
   },
   {
     "name": "ambulance",
     "category": 'protection',
     "index": 0,
     "lane": 1,
     "x": 6,
     "order": 1
   },
   {
     "name": "ambulance",
     "category": 'protection',
     "index": 0,
     "lane": 1,
     "x": 7,
     "order": 1
   }
    ]],
    
    "backgrounds":{
      
      "layer1":[{"name":"secondary_skyline.png"}],
      "layer2":[{"name":"main_skyline.png"}],
      "landmarks":[{"name":"landmark_1.png"},{"name":"landmark_2.png"}],
      "fence":[{"name":"fence.png"}],
      "lamp":[{"name":"3amod.png"}],
      "land":[{"name":"land.png"}]
     },
      
      "environment":"day","gameModes":["normal"]}

var  crowd_members = { 
        'bottleguy' : { 1 : {'level' : 1, 'upgrades' : { 'hp' : [], 'water' : [], 'attack' : [], 'defense' : [], 'arrest' : 0, 'block' : 0 } } 
      ,2 : {'level' : 1, 'upgrades' : { 'hp' : [], 'water' : [], 'attack' : [], 'defense' : [], 'arrest' : 0, 'block' : 0 }}}
   }

var userData = {
  'crowd_members' : { 
        'bottleguy' : { 1 : {'level' : 1, 'upgrades' : { 'hp' : [], 'water' : [], 'attack' : [], 'defense' : [], 'arrest' : 0, 'block' : 0 } } 
      ,2 : {'level' : 1, 'upgrades' : { 'hp' : [], 'water' : [], 'attack' : [], 'defense' : [], 'arrest' : 0, 'block' : 0 }}}
   }, 
  'holder_items' : { 'cap' : 0, 'umbrella' : 0 },
  'special_items' : { },
  'power_ups' : {}, 
  'current_mission': 1,
  'energy' : 20,
  'missions' : {}, 
  'scores' : {}
}

var gameData = { 
      "modes" : {},
      "ranks" : {},
      "products" : { "fb" : {} },
      'missions' : { },
      'commands' : { 'march' : { '1' : {'speed':1, 'ramming':1}, '2' : {'speed':2, 'ramming':2} } },
      'upgrades' : { 'arrest' : { 1 : 1, 2 : 2, 3 : 3, 4 : 4 },
                      'block' : { 1 : 1, 2 : 2, 3 : 3, 4 : 4 },
                      'defense' : { 1 : 5, 2 : 10, 3 : 20 },
                      'attack' : { 1 : 5, 2 : 10, 3 : 20 },
                      'hp' : { 1 : 5, 2 : 10, 3 : 20 },
                      'h2o' : { 1 : 5, 2 : 10, 3 : 20 } 
                    },
      'holder_items' : { 'cap' : {}, 'umbrella' : {}, 'cola' : {}, 'rag' : {}, 'gas_mask' : {}, 'hammer' : {}, 'lock_pic' : {} },
      'crowd_items' : {  'shield' : { 1 : 10, 2 : 25, 3 : 40 },
                          'drum' : { 1 : 10, 2 : 20, 3 : 30 }
                      },
      'special_items' : { 'energy' : { 1 : 25, 2 : 50, 3 : 100 }, 'wash_powder' : { 'dirt' : 0 } },
      'power_ups' : { 'followers' : { 1 : { 'time' : 30 , 'amount' : 1 }, 2 : { 'time' : 60 , 'amount' : 1 }, 3 : { 'time' : 120 , 'amount' : 1 } }, 
                      'invencible' :  { 1 : { 'time' : 30 }, 2 : { 'time' : 60 }, 3 : {  'time' : 120 } }, 
                      'cure' : { 'hp' : 100 }, 
                      'healer' : { 1 : { 'time' : 30}, 2 : { 'time' : 60}, 3 : { 'time' : 90} },
                      'dehydrator' : { 1 : { 'time' : 30 }, 2 : { 'time' : 60 }, 3 : { 'time' : 120 } },
                      'defense_1' : { 1 : { 'time' : 30 , 'amount' : 25 }, 2 : { 'time' : 60 , 'amount' : 25 }, 3 : { 'time' : 120 , 'amount' : 25 } },
                      'defense_2' : { 1 : { 'time' : 30 , 'amount' : 50 }, 2 : { 'time' : 60 , 'amount' : 50 }, 3 : { 'time' : 120 , 'amount' : 50 } },
                      'attack_1' : { 1 : { 'time' : 30 , 'amount' : 25 }, 2 : { 'time' : 60 , 'amount' : 25 }, 3 : { 'time' : 120 , 'amount' : 25 } },
                      'attack_2' : { 1 : { 'time' : 30 , 'amount' : 50 }, 2 : { 'time' : 60 , 'amount' : 50 }, 3 : { 'time' : 120 , 'amount' : 50 } }
                     },
      'ingame_power_ups' : { 
                      'healer' : { 1 : 10, 2 : 20, 3 : 30 },
                      'dehydrator' : { 1 : 10, 2 : 20, 3 : 30 }
                     },
      'crowd_members' : {
              'category' : { 'salafy' : {type : 'normal', name : 'Normal'},
                        'ultras_green' : {type : 'normal', name : 'Normal'},
                        'ultras_white' : {type : 'normal', name : 'Normal'},
                        'ultras_red' : {type : 'normal', name : 'Normal'},
                        'journalist' : {type : 'normal', name : 'Normal'},
                        'attacker' : {type : 'special', name : 'Attacker'},
                        'leader' : {type : 'special', name : 'Leader'},
                        'healer' : {type : 'special', name : 'Healer'},
                        'bottleguy' : {type : 'special', name : 'Bottle Guy'},
                        'energy_booster' : {type : 'special', name : 'Energy Booster'}
              },
              'specs' : { 
                    'normal' : { 1 : { 'hp' : 50, 'water' : 50, 'attack' : 5, 'defense' : 50 } } , 
                    'attacker' : { 1 : { 'special' : { 'attack' : 1 }, 'hp' : 75, 'water' : 50, 'attack' : 10, 'defense' : 50 } },
                    'leader' : { 1 : { 'special' : { 'followers' : 1 }, 'hp' : 50, 'water' : 25, 'attack' : 5, 'defense' : 25 } },   
                    'healer' : { 1 : { 'special' : { 'time' : 2, 'units' : 1, 'hp' : 10 }, 
                                                       'hp' : 75, 'water' : 75, 'attack' : 2, 'defense' : 75 } 
                                },
                    'bottleguy' : { 1 : { 'special' : { 'time' : 2, 'units' : 1, 'water' : 10}, 
                                                            'hp' : 75 , 'water' : 75 , 'attack' : 2  , 'defense' : 75 }  
                                },
                    'energy_booster' : { 1 : { 'special' : { 'slots_to_power' : 1, 'time' : 10, 'energy' : 5 },
                                                'hp' : 25, 'water' : 75, 'attack' : 2, 'defense' : 25 }
                                }
              }  

        }, 
        'enemies' : { 'wood_stick_cs' : {
                                        '1_1' : {'hp' : 25, 'attack' : 10 , 'defense' : 25, 'charge_tolerance' : 1, 'circle_size' : 1 },
                                        '1_2' : {'hp' : 50, 'attack' : 20 , 'defense' : 35, 'charge_tolerance' : 1, 'circle_size' : 1 },  
                                        '1_3' : {'hp' : 100, 'attack' : 40 , 'defense' : 50, 'charge_tolerance' : 2, 'circle_size' : 1 },  
                                        '2_3' : {'hp' : 200, 'attack' : 80 , 'defense' : 70, 'charge_tolerance' : 3, 'circle_size' : 2 },  
                                        '3_3' : {'hp' : 300, 'attack' : 100 , 'defense' : 90, 'charge_tolerance' : 3, 'circle_size' : 3 },  
                                        '6_3' : {'hp' : 600, 'attack' : 150 , 'defense' : 100, 'charge_tolerance' : 4, 'circle_size' : 4 },
                                        '9_3' : {'hp' : 900, 'attack' : 200 , 'defense' : 120, 'charge_tolerance' : 4, 'circle_size' : 5 },    
                                     },
                      'tear_gas_gunner_cs' : { 
                                        'rate' : { 'time' : 5, 'shots' : 1 }, 
                                        '1_1' : { 'attack' : 5, 'charge_tolerance' : 1, 'circle_size' : 1 },
                                        '1_2' : { 'attack' : 10, 'charge_tolerance' : 1, 'circle_size' : 1 },
                                        '1_3' : { 'attack' : 15, 'charge_tolerance' : 2, 'circle_size' : 2 }
                                      },
                      'kalabshat_blocker_cs' : { 
                                        '1_1' : { 'block_ability' : 1 },
                                        '1_2' : { 'block_ability' : 2 },
                                        '1_3' : { 'block_ability' : 3 }
                      }, 
                      'kalabshat_arrestor_cs' : { 
                                        '1_1' : { 'arrest_ability' : true }
                      },
                      'kalabshat_blocker_pc' : { 'cars' : 1, 'hp' : 150, 'defense' : 70, 'charge_tolerance' : 2,
                                                    'circle_size' : 2, 'kalabshat_blocker_cs' : 1 }, 
                      'kalabshat_arrestor_pc' : { 'cars' : 1, 'hp' : 150, 'defense' : 70, 'charge_tolerance' : 2,
                                                   'circle_size' : 2, 'kalabshat_arrestor_cs' : ['1_1', '1_2', '1_3'] }, 
                      'troop_carrier' : { 'cars' : 1, 'hp' : 200, 'defense' : 90, 'charge_tolerance' : 3,
                                                    'circle_size' : 2, 'wood_stick_cs' : ['1_1', '1_2', '1_3', '2_3', '3_3'] }, 
  
        }
}

