import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import './styles/App.sass'
class App extends Component {
    state = {
        places: [],
        editButtonClicked: false,
        editedLat: '',
        editedLng: '',
        editedPositionIndex: null,
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
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=AIzaSyC46RSzlBLMWamEoa9fqC8yT1OXjHY7mUc`)
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

    /**
     * Edit lat and long of the marker
     * @param index
     * @param place
     */
    editMarker = (index, place) => {
        this.setState({
            editButtonClicked: true,
            editedLat: place.lat,
            editedLng: place.lng,
            editedPositionIndex: index,
        })
    };

    /**
     * Save edited position after changing lat and long
     * @param e
     */
    saveEditedPosition = (e) => {
        e.preventDefault();
        const places = [...this.state.places];
        places[this.state.editedPositionIndex].lat = this.state.editedLat;
        places[this.state.editedPositionIndex].lng = this.state.editedLng;
        this.setState({
            editButtonClicked: false,
            places
        })
    };

    /**
     * Update lat and long after change their values
     * @param e
     */
    updateLatLng = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value,
        });
    };

    /**
     * Close dialog
     */
    closeDialog = () => {
        this.setState({
            editButtonClicked: false,
        })
    };

    /**
     * Delete All Markers
     */
    deleteAllMarkers = () => {
        this.setState({
            places: [],
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
                        <h1 className="wrapper__map-header-title">
                            Kindly select some points in the map
                        </h1>
                    }
                    {
                        this.state.places.length > 0 &&
                            <div className="wrapper__map-header">
                                <h1 className="wrapper__map-header-title">The Markers Number is: {this.state.places.length}</h1>
                                <button className="btn delete-btn"
                                        onClick={() => this.deleteAllMarkers()}>
                                    Delete All Markers
                                </button>
                            </div>
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
                                <div className="wrapper__map-item-buttons">
                                    <button className="btn delete-btn"
                                            onClick={() => this.deleteMarker(index)}>Delete</button>
                                    <button className="btn edit-btn"
                                            onClick={() => this.editMarker(index, place)}>Edit</button>
                                </div>
                            </div>
                        ))
                    }

                </div>
                {
                    this.state.editButtonClicked &&
                    <div className="dialog">
                        <div className="dialog__wrapper">
                            <div className="dialog__title">
                                Edit Marker Position
                            </div>
                            <form className="dialog__form">
                                <input type="text"
                                       name="editedLat"
                                       placeholder="Enter Latitude"
                                       onInput={(e) => this.updateLatLng(e)}
                                       value={this.state.editedLat}
                                       className="dialog__field"
                                />
                                {
                                    this.state.editedLat.length === 0 &&
                                    <span className="dialog__error">
                                        Kindly add the position latitude
                                    </span>
                                }
                                <input
                                    type="text"
                                    name="editedLng"
                                    placeholder="Enter Longitude"
                                    onInput={(e) => this.updateLatLng(e)}
                                    value={this.state.editedLng}
                                    className="dialog__field"
                                />
                                {
                                    this.state.editedLng.length === 0 &&
                                    <span className="dialog__error">
                                        Kindly add the position longitude
                                    </span>
                                }
                                <div className="dialog__button-wrapper">
                                    <button className={`btn default-btn
                                    ${(this.state.editedLat.length === 0 || this.state.editedLng.length === 0) && 'disabled-btn'}`}
                                            disabled={this.state.editedLat.length === 0 || this.state.editedLng.length === 0}
                                            onClick={(e) => this.saveEditedPosition(e)}>Save</button>
                                    <button className="btn delete-btn"
                                            onClick={() => this.closeDialog()}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </section>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyC46RSzlBLMWamEoa9fqC8yT1OXjHY7mUc')
  })(App)
