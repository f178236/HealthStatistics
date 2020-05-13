function CalculateTTest(col1_data,col2_data){

    
    console.log(col1_data);
    var mean1=meanFunc(col1_data,col1_data.length);
    console.log("Ok 1");
    var mean2=meanFunc(col2_data,col2_data.length);
    var sd1=standardDeviation(col1_data,col1_data.length);
    var sd2=standardDeviation(col2_data,col2_data.length);
    
    var t_test = (mean1 - mean2) / Math.sqrt((sd1 * sd1) / col1_data.length + (sd2 * sd2) / col2_data.length);
    console.log("Ok 3");

    return t_test;
}



