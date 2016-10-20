import React from 'react';
import { getFunName } from '../helpers';


class StorePicker extends React.Component {
    // ALTERNATIVE BINDING OF this (i.e make 'this' = StorePicker component)
    // constructor() {
    //     super();
    //     this.goToStore = this.goToStore.bind(this);
    // }
    goToStore(event) {
        event.preventDefault();
        //grab text from box
        const storeId = this.storeInput.value;
        //transition from "/" to "/store/:storeId"
        this.context.router.transitionTo(`/store/${storeId}`);
    }

    render (){
        return (
            <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
                <h2> Please Enter A Store!</h2>
                <input type="text" required placeholder="Store Name" defaultValue={
                    getFunName()} ref={(input) => { this.storeInput = input}} />
                <button type="submit"> Visit Store→</button>
            </form>
        )
    }
}

StorePicker.contextTypes = {
    router: React.PropTypes.object
}

export default StorePicker;
