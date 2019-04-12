import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import './styles/App.sass'
class App extends Component {
    state = {
        places: [],
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
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lng + '&key=' + 'AIzaSyC46RSzlBLMWamEoa9fqC8yT1OXjHY7mUc')
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

    render() {
        return (
            <section className="wrapper">
                <div className="wrapper__map">
                    <Map
                        style={{ height: '100vh', width: '50vw' }}
                        onClick={this.addNewMarker}
                        google={this.props.google}
                    >
                        {this.state.places.length > 0 &&
                            this.state.places.map(place => (
                                <Marker
                                    key={`${place.lat} - ${place.lng}`}
                                    position={place}
                                    name="Test Test"/>
                            ))
                        }
                    </Map>
                </div>
                <div className="wrapper__list">
                    {
                        this.state.places.length === 0 &&
                        <h1 className="wrapper__no-markers">
                            Kindly select some points in the map
                        </h1>
                    }
                    {
                        this.state.places.length > 0 &&
                            <h1>The Markers Number is: {this.state.places.length}</h1>
                    }
                    {
                        this.state.places.length > 0 &&
                        this.state.places.map((place, index) => (
                            <div className="wrapper__map-item"
                                 key={`${place.lat} - ${place.lng}`}>
                                <p>{`Latitude: ${place.lat}`}</p>
                                <p>{`Longitude: ${place.lng}`}</p>
                                <p>
                                    City Name: <b>{place.cityName}</b>
                                </p>
                                <button onClick={() => this.deleteMarker(index)}>Delete</button>
                            </div>
                        ))
                    }
                </div>
            </section>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyC46RSzlBLMWamEoa9fqC8yT1OXjHY7mUc')
  })(App)
