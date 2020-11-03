import React, { useState, useContext } from 'react';
import './PlaceItem.css';
import { useHistory } from 'react-router-dom';
//import custom hooks
import { useHttpClient } from "../../../shared/hooks/http-hook";
//importing components
import Button from "../../../shared/components/FormElements/Button/Button";
import Modal from "../../../shared/components/Modal/Modal";
import ErrorModal from "../../../shared/components/Modal/ErrorModal";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
//importing context
import { AuthContext } from "../../../shared/context/auth-context";

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: props.lat, lng: props.lng }}
    >
    {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.lng }} />}
  </GoogleMap>
))

const PlaceItem = ({place}) => {

    const auth = useContext(AuthContext);

    const history = useHistory();
    console.log(place);
    const {id,
        image,
        title,
        description,
        address,
        location,
        creator} = place;

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [showMap, setShowMap] = useState(false);
    const openMapHandler = ( ) => setShowMap(true);
    const closeMapHandler = ( ) => setShowMap(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const openConfirmModalHandler = ( ) => setShowConfirmModal(true);
    const closeConfirmModalHandler = ( ) => setShowConfirmModal(false);

    const [isDeleted, setIsDeleted] = useState(false);
    const openIsDeletedModal = () => setIsDeleted(true);
    const closeIsDeletedModal = () => {
        history.push(`http://localhost:3000/api/places/user/${auth.userId}`);
        setIsDeleted(false);
    }

    const confirmDeleting = async () => {
        closeConfirmModalHandler();
        try {
            await sendRequest(
                `http://localhost:5000/api/places/${id}`,
                'DELETE'
            );
            openIsDeletedModal();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <React.Fragment>
            <Modal show={showMap}
                   onCancel={closeMapHandler}
                   header={address}
                   footer={ <Button onClick={closeMapHandler}>Close</Button>}>
                <div className='mapContainer'>
                    <MyMapComponent
                        isMarkerShown
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        lat={location.lat}
                        lng={location.lng}
                    />
                </div>
            </Modal>
            <Modal show={showConfirmModal}
                   onCancel={closeConfirmModalHandler}
                   header='Are you sure?'
                   footer={
                       <React.Fragment>
                           <Button inverse onClick={closeConfirmModalHandler}>CANCEL</Button>
                           <Button danger onClick={confirmDeleting} >DELETE</Button>
                       </React.Fragment>
                   }>
                <p>Do you want to proceed and delete this place?</p>
            </Modal>
            <Modal show={isDeleted}
                   onCancel={closeIsDeletedModal}
                   header='Deleted successfully'
                   footer={
                       <React.Fragment>
                           <Button inverse onClick={closeIsDeletedModal}>CLOSE</Button>
                       </React.Fragment>
                   }>
            </Modal>
            {error && <ErrorModal error={error} onClear={clearError}/>}
            {isLoading && <LoadingSpinner asOverlay/>}
            <li key={id} className='placeContainer'>
                <div className="placeImage">
                    <img src={ image } alt={ title } />
                </div>
                <div className='placeInfo'>
                    <h2>{title}</h2>
                    <h3>{address}</h3>
                    <p>{description}</p>
                </div>
                <div className='placeButtons'>
                    <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                    {auth.userId === creator && (
                        <React.Fragment>
                            <Button to={`/api/places/${id}`}>EDIT</Button>
                            <Button danger onClick={openConfirmModalHandler}>DELETE</Button>
                        </React.Fragment>
                    )}

                </div>
            </li>
        </React.Fragment>
    );
};

export default PlaceItem;
