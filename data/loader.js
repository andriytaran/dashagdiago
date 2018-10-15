//Reads json file and generates elasticsearch bulk api compatible json document

var inputFile = "./cincinnati.json";

var outputFile = "./es_cincinnati.json";

var index = "cincinnati";

var type= "post";

var fs = require('fs');

var jsonContent = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

var stream = fs.createWriteStream(outputFile);

stream.once('open', function(fd) {

  for(var object in jsonContent)
  {
      //For _id as sequence no.
//      stream.write("{ \"index\" : { \"_index\" : \""+index+"\", \"_type\" : \""+type+"\", \"_id\" : \""+object+"\" } }\n")

      //For _id as document id
      stream.write("{ \"index\" : { \"_index\" : \""+index+"\", \"_type\" : \""+type+"\", \"_id\" : \""+jsonContent[object].id+"\" } }\n")

    stream.write(JSON.stringify(jsonContent[object])+"\n")
  }

  stream.end();
});
