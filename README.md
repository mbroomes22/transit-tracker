
# transit-tracker


# ruby_project

The coolest dang train tracking program that you ever did see.

## Dependencies

* [Ruby](https://www.ruby-lang.org/en/).  Written with version [3.4.2](https://www.ruby-lang.org/en/news/2025/02/14/ruby-3-4-2-released/) - *[docs](https://docs.ruby-lang.org/en/3.4/)*.

## Usage

Install deps: `gem install bundler && bundle install`.  Run `bundle exec rake` to run the tests, or `bundle exec rake run` to run the program.

Here is a video of the site run on localhost:
[![Watch the first video](./site/transit-tracker-gif-1)]
[![Watch the second video](./site/transit-tracker-gif-2)]

APIs from (https://developer.geops.io/) & (https://www.mbta.com/developers/v3-api):
Realtime Websocket API - To track Vehicle positions & stop sequences based on scheduled times & real time updates.
Maps API - Obtains maps based on mapbox vector tiles.

Frontend uses React based Map Visualizations detailed here:[https://react-spatial.geops.io](https://react-spatial.geops.io/?baselayers=basebright.baselayer,basedark.baselayer&layers=swiss.boundaries&mode=custom&x=876887.69&y=5928515.41&z=5)

App is hosted on Google Firebase

* uncomment these files to get firebase working again: 
client/src/firebaseConfig.js
node_modules/@firebase/app/dist/esm/app/src/firebaseApp.d.ts

