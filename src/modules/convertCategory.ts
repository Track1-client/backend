async function convertCategory(categoryList: any) {
    var mapObj: {[x: string]: string} = {
        0: "R&B",
        1: "Hiphop",
        2: "Ballad",
        3: "Pop",
        4: "Rock",
        5: "EDM",
        6: "JAZZ",
        7: "House",
        8: "Funk"
    };
    
    const categList: string = (JSON.stringify(categoryList)).replace(" ","");
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    
    const convertResult = categList.replace(re, function(matched){
        return mapObj[matched];
    });
    
    return JSON.parse(convertResult);
};

export default convertCategory;