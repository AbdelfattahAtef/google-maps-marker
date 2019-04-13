import React, { Component } from 'react';
import './list.sass'
class List extends Component {
    state = {
        editButtonClicked: false,
        editedLat: '',
        editedLng: '',
        editedPositionIndex: null,
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
        this.setState({
            editButtonClicked: false,
        });
        this.props.saveEditedPosition(this.state.editedPositionIndex, this.state.editedLat, this.state.editedLng)
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

    render(){
        const {places} = this.props;
        return (
            <div className="wrapper__list">
                {
                    places.length === 0 &&
                    <h1 className="wrapper__map-header-title">
                        Kindly select some points in the map
                    </h1>
                }
                {
                    places.length > 0 &&
                    <div className="wrapper__map-header">
                        <h1 className="wrapper__map-header-title">The Markers Number is: {places.length}</h1>
                        <button className="btn delete-btn"
                                onClick={() => this.props.deleteAllMarkers()}>
                            Delete All Markers
                        </button>
                    </div>
                }
                {
                    places.length > 0 &&
                    places.map((place, index) => (
                        <div className="wrapper__map-item"
                             key={`${place.lat} - ${place.lng}`}>
                            <p>{`Latitude: ${place.lat}`}</p>
                            <p>{`Longitude: ${place.lng}`}</p>
                            <p>
                                City Name: <b>{place.cityName}</b>
                            </p>
                            <div className="wrapper__map-item-buttons">
                                <button className="btn delete-btn"
                                        onClick={() => this.props.deleteMarker(index)}>Delete</button>
                                <button className="btn edit-btn"
                                        onClick={() => this.editMarker(index, place)}>Edit</button>
                            </div>
                        </div>
                    ))
                }
                {
                    this.state.editButtonClicked &&
                    <div className="dialog">
                        <div className="dialog__wrapper">
                            <div className="dialog__title">
                                Edit Marker Position
                            </div>
                            <form className="dialog__form">
                                <label htmlFor="lat" className='dialog__input-title'>Enter Latitude</label>
                                <input type="text"
                                       id="lat"
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
                                <label htmlFor="lng" className="dialog__input-title">Enter Longitude</label>
                                <input
                                    type="text"
                                    id="lng"
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
            </div>
        );
    }
}
export default List