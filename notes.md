
# Project notes
## Dependencies:
-csv-write-stream: CSV writing package

## Technology stack: 
Just Node.js
Alternatively: A mongoDB database could be used to solve this problem:
-Read the JSON files
-Store all the documents in the mongo base
-Get project report and user report using mongoDB aggregate queries
-Write CSV files

## Possible improvments:
### Error checking: 
The script works because data source is automatically generated data. A real data source would probably contains incorrect data (example: unexisting authorId from project).
In this case, an error handling strategy would prevent the script failing.

### Memory limit:
 In case of really big JSON files, use of a mongo database would probably be mandatory, to avoid loading huge arrays of objects into memory

## About generate-data.js
Script fails right after install on writing visits.json file.
--> Memory error because the array to stringify before writing is too big
Script fails when memory limit set to 128MB
--> Memory error --> Node.js heap out of memory because arrays are too large

--> need to optimize it to run on low memory machines
To prevent this behaviour, generate-data.js was modified as following:
-Generated objects are written on the fly to a json file, to prevent Node.js heap out of memory error
-This also prevents using JSON.stringify on a very large object