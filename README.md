# CoronaSafe Dashboard

[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/0)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/0)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/1)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/1)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/2)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/2)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/3)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/3)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/4)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/4)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/5)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/5)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/6)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/6)[![](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/images/7)](https://sourcerer.io/fame/tomahawk-pilot/coronasafe/dashboard/links/7)

![CoronaSafe+War+Room+Home+Page+1](https://user-images.githubusercontent.com/14979190/118388552-e4f09180-b642-11eb-8a17-034e4e98c0c6.jpg)


### Objective
The dashboard presents actionable intel using data tracked by [coronasafe/care](https://github.com/coronasafe/care) to administrators in order to take decisions based on ground conditions

# Project Setup
In the project directory, you can run:

Run `'npm install'` to install the dependencies.
Run `'npm start'` to start running the project on a development server.


Run `'npm build'` to create an optimized production build.

## Maps for Districts

The Map Preview of Facilities in the dashboard can be setup with some prerequisites.
1. Make sure that the facilities in Care are mapped(latitude and longitude are available)
2. Source a District Level TopoJSON for the state you're deploying. Example: [kerala_district.json](https://raw.githubusercontent.com/coronasafe/dashboard/master/public/kerala_district.json)
3. Source a more Precise TopoJSON with data within the district. Example: [kerala_lsgd.json](https://raw.githubusercontent.com/coronasafe/dashboard/master/public/kerala_lsgd.json)

Once you have the prerequisites covered you could replace the TopoJSON source in utils.js -> useKeralaMap()

Note: If you make changes to the codebase, try to make sure that it allows a more generic use case so that it can be merged into the Core Codebase and updates can be received to your Fork.
Once you have the pre
