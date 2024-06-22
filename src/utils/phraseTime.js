import moment from "moment";
const now = moment().format('HH')

export const phraseDay = () => {
    if( now < 6){
        return 'Buenas noches'
    } else if (now < 12){
        return 'Buenos días'
    } else if (now < 18){
        return 'Buenas tardes'
    } else {
        return 'Buenas noches'
    }
}

