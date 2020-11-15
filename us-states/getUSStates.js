const axios = require('axios')
const cheerio = require('cheerio')

const page_url = 'https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States'

async function getUSStates(){
  const { data } = await axios.get(page_url)
  const $ = cheerio.load(data)
  const table = $('caption:contains("States of the United States")').parent()
  const states = []
  table.find('tbody tr').slice(2).each((i, element) => {
    const $row = $(element)
    const state = {}
    state.name = $row.find('th a').first().text().trim() 
    const labels = [
      'code', 
      'capital',
      'largest', 
      'ratification', 
      'population', 
      'total_area_miles', 
      'total_area_km',
      'land_area_miles',
      'land_area_km',
      'water_area_miles',
      'water_area_km',
      'number_of_reps'
    ]

    let offset = 0
    $row.find('td').each((i, element) => {
      const $col = $(element)
      const value = $col.text().trim()
      if (i === 1 && $col.attr('colspan') === '2'){
        const label = labels[i]
        state[label] = value
        offset = 1
      }else{
        const label = labels[i + offset]
        state[label] = value
      }
      
    })
    
  states.push(state)
  }) 
  return states
}

module.exports = getUSStates