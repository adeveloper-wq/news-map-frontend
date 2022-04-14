import * as React from 'react';

function ControlPanel(props) {
  const { startTime, endTime, onChangeTime, allDays, onChangeAllDays, selectedTime, allDatesArray, absoluteCount, onChangeAbsoluteCount, chosenLocationData } = props;
  const onSelectDay = evt => {
    onChangeTime(evt.target.value);
  };

  let countrieAppearances = {}
  let countries = [];
  let allLocationsCount = 0;

  if (chosenLocationData !== undefined){
    chosenLocationData.features.forEach(feature => {
      allLocationsCount = allLocationsCount + 1;
      if (feature.country in countrieAppearances){
        countrieAppearances[feature.country] = countrieAppearances[feature.country] + 1;
      }else{
        countrieAppearances[feature.country] = 1
      }
    });

    countries = Object.keys(countrieAppearances);

    countries.sort(function(a, b) { return countrieAppearances[b] - countrieAppearances[a] });
  }

  const getCountryStatistic = country => {
    if(absoluteCount){
      return countrieAppearances[country];
    }else{
      return Math.round((countrieAppearances[country] / allLocationsCount) * 10000) / 100 + "%";
    }
  };

  return (
    <div className='absolute top-2 right-2 bg-white py-2 px-4 rounded drop-shadow-md flex flex-row'>
      {allDatesArray && <div>
        <p>
          Map showing locations that were mentioned in news articles
          <br />
          from <b>{allDatesArray[startTime].date}</b> to <b>{allDatesArray[endTime].date}</b>. {allLocationsCount} locations found. 
        </p>
        <hr />
        <div>
          <label>All Days</label>
          <input
            type="checkbox"
            name="allday"
            checked={allDays}
            onChange={evt => onChangeAllDays(evt.target.checked)}
          />
        </div>
        <div>
          <label>Absolute Values</label>
          <input
            type="checkbox"
            name="absoluteValues"
            checked={absoluteCount}
            onChange={evt => onChangeAbsoluteCount(evt.target.checked)}
          />
        </div>
        <div>
          <label>Each Day: {allDatesArray[selectedTime].date}</label>
          <input
            type="range"
            disabled={allDays}
            min={0}
            max={allDatesArray.length-1}
            value={selectedTime}
            step={1}
            onChange={onSelectDay}
          />
        </div>
        {countries !== undefined &&
          <div className='mt-1 max-h-40 bg-white py-2 px-4 rounded drop-shadow-md grid grid-cols-1 overflow-y-auto'>{
            countries.map((country, i) => {
            return <div key={i}>
              {i !== 0 && <hr className="border-t-black-500 my-1" />}
              <div className='inline-flex'>
                <span className='px-1.5 duration-200 rounded-md w-56 mr-4'>{country + ": " + getCountryStatistic(country)}</span>
              </div>
            </div>
          })
        }</div>}
        </div>}
    </div>
  );
}

export default React.memo(ControlPanel);