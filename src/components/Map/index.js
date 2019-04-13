import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import List from '../List';
import './map.sass'

class GoogleMap extends Component {
    state = {
        places: []
    };

    /**
     * Add new marker to the map
     * @param mapProps
     * @param map
     * @param clickEvent
     */
    addNewMarker = (mapProps, map, clickEvent) => {
        let places = this.state.places;
        const lat = clickEvent.latLng.lat();
        const lng = clickEvent.latLng.lng();
        let cityName = 'There is something wrong, Unknown City Name';
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=${process.env.MAP_API_KEY}`)
            .then((response) => response.json())
            .then((responseJson) => {
            if(responseJson.results.length !== 0){
                cityName = responseJson.results[0].formatted_address;
            }
        });
        const addressDate = {lat, lng, cityName};
        places.push(addressDate);
        this.setState({
            places
        });
    };

    /**
     * Delete All Markers
     */
    deleteAllMarkers = () => {
        this.setState({
            places: [],
        });
    };

    /**
     * Delete marker from the map
     * @param index
     */
    deleteMarker = (index) => {
        const places = [...this.state.places];
        if (index !== -1) {
            places.splice(index, 1);
            this.setState({places});
        }
    };

    /**
     * Save edited position after changing lat and long
     * @param e
     * @param index
     * @param editedLat
     * @param editedLng
     */
    saveEditedPosition = (index, editedLat, editedLng) => {
        const places = [...this.state.places];
        places[index].lat = editedLat;
        places[index].lng = editedLng;
        this.setState({
            places
        })
    };

    render() {
        return (
            <section className="wrapper">
                <div className="wrapper__map">
                    <Map
                        style={{ height: '100%', width: '100%' }}
                        onClick={this.addNewMarker}
                        google={this.props.google}
                        zoom={6}
                        initialCenter={{
                            lat: 51.1657,
                            lng: 10.4515
                        }}
                    >
                        {this.state.places.length > 0 &&
                            this.state.places.map((place, index) => (
                                <Marker
                                    key={`${place.lat} - ${place.lng} - ${index}`}
                                    position={place}
                                    name="Test Test"/>
                            ))
                        }
                    </Map>
                </div>
                <List
                    places={this.state.places}
                    deleteAllMarkers={this.deleteAllMarkers}
                    deleteMarker={this.deleteMarker}
                    saveEditedPosition={this.saveEditedPosition}
                />
            </section>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.MAP_API_KEY),
  })(GoogleMap)
