
# pricespy-scraper
This project is use to scrape pricespy of products based on your input.

## Quick Start
Install the dependencies.

    $ npm i
    
Start the server:

    $ npm start
    
View the website at: [http://localhost:8000](http://localhost:8000)

### Example
View the website at: [http://localhost:8000/search/intel 8600](http://localhost:8000/search/intel%208600)
This will return a json object after some time. (You can see the progress in the console)
```json
[
	{
		"Name":"Intel Core i5 8600K 3.6GHz Socket 1151-2 Box without Cooler",
		"Price":"$379.41",
		"Link":"https://pricespy.co.nz/product.php?p=4447772",
		"Stats":{
			"Brand":"Intel",
			"CPU type":"Intel Core i5 Gen 8",
			"Socket":"Intel Socket 1151-2",
			"Number of cores":"6",
			"Number of threads":"6",
			"Clock frequency":"3.6 GHz",
			"Thermal Design Power (TDP)":"95 W"
		}
	}
]
```

It will also write the output to products.json

## Available Routes

 - /search
	 - /:productNameHere
