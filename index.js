import ics from './ics.js';
// my IIFE
(function(){

    const parseTable = ()=>{
        let $tbody = document.querySelector('tbody');

        const dataAsArray = [[],[],[],[],[]];
        let time = 9;
        for(const $tr of $tbody.children)
        {
            let timeRow = true;
            let arrayIndex = 0;
            for(const $td of $tr.children)
            {
                if(timeRow)
                {
                    timeRow = false;
                }
                else
                {
                    if($td.className)
                    {
                        let [_rawText, module, lectureHall] = $td.innerText.match(/([A-Z]{2}[0-9]{3}).+\[\s+(.+)\s+]/);
                        dataAsArray[arrayIndex].push({module, lectureHall, time});
                    }
                    arrayIndex++;
                }
            }
            time++;
        }
        return dataAsArray;
    }

    const buildCalender = (cal)=>{
        const dataAsArray = parseTable();
        const firstDay = new Date('2025/09/22');
        const lastDay = new Date('2025/12/19');

        let date = new Date(firstDay);

        while(date < lastDay)
        {
            for(let day of dataAsArray)
            {
                for(let lecture of day)
                {
                    const start = new Date(date);
                    start.setHours(lecture.time);
                    start.setMinutes(5);
                    const end = new Date(date);
                    end.setHours(lecture.time);
                    end.setMinutes(55);
                    cal.addEvent(lecture.module,lecture.module,lecture.lectureHall,start, end);
                }
                // next day
                date.setDate(date.getDate() + 1);
            }
            // weekends
            date.setDate(date.getDate() + 2);
        }
    }

    const load = ()=>{
        const cal = ics();

        buildCalender(cal);
        document.getElementById('download').addEventListener('click',()=>{
            cal.download("Lectures");
        });
    }
    document.addEventListener("DOMContentLoaded", load);
})();