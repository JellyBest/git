function GetMktByCode(code) {
    if (code.Length < 3)
        return "sh";
    var one = code.substr(0, 1);
    var three = code.substr(0, 3);
    if (one == "5" || one == "6" || one == "9") {
        return "sh";
    }
    else {
        if (three == "009" || three == "126" || three == "110" || three == "201" || three == "202" || three == "203" || three == "204") {
            return "sh";
        }
        else {
            return "sz";
        }
    }
}

function GetMktByCodeList(codelist) {
    let arrList = [];
    for(item of codelist){
        arrList.push(GetMktByCode(item) + item);
    }
    return arrList;
}

module.exports = {
    GetMktByCode: GetMktByCode,
    GetMktByCodeList: GetMktByCodeList
}