const convertDate = function(inputDate) {
    let d = new Date(inputDate);
    let format = 'DD/MM/YYYY';
    if(format === 'DD/MM/YYYY'){
        return d.toLocaleDateString();
    }
}

export default convertDate;