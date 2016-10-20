import React from 'react';
import AddFishForm from "./AddFishForm";
import base from '../base';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount() {
        base.onAuth((user) => {
            if(user) {
                this.authHandler(null, { user });
            }
        })
    }

    authenticate(provider) {
        console.log(`Trying to login with ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    authHandler(errorMessage, authenticationData) {
        console.log(authenticationData);
        if(errorMessage) {
            console.error(errorMessage);
            return;
        }
        

        // if they authenticate, we need to grab info like store name, from
        // fireb    
        const storeRef = base.database().ref(this.props.storeId);
        // query firebase once for store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};
        // claim the store for the user if there is no current owner
            if(!data.owner) {
                storeRef.set({
                    owner: authenticationData.user.uid
                });
            }

        //now set state for user
            this.setState({
                uid: authenticationData.user.uid,
                owner: data.owner || authenticationData.user.uid
            })
        });
    }

    logout() {
        base.unauth();
        this.setState({uid: null});
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        //TAKE COPY OF FISH AND UPDATE WITH NEW DATA
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        }
        this.props.updateFish(key, updatedFish);
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2> Inventory </h2>
                <button className="github" onClick={() => this.authenticate('github')}>
                    Login with Github
                </button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>
                    Login with Facebook
                </button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>
                    Login with Twitter
                </button>
            </nav>
        )
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return(
            <div className="fish-edit" key={key}>
                <input type="text" name="name" value={fish.name} placeholder="Fish Name"
                    onChange={(e) => this.handleChange(e, key)}/>
                <input type="text" name="price" value={fish.price} placeholder="Fish Price"
                    onChange={(e) => this.handleChange(e, key)}/>

                <select type="text" name="status" value={fish.status} placeholder="Fish Status"
                    onChange={(e) => this.handleChange(e, key)}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>

                <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc"
                    onChange={(e) => this.handleChange(e, key)}>
                    </textarea>
                <input type="text" name="image" value={fish.image} placeholder="Fish Image"
                    onChange={(e) => this.handleChange(e, key)}/>
                <button onClick={() => this.props.removeFish(key)}> Remove Fish </button>
            </div>
        )
    }

    render() {
        const logoutButton = <button onClick={this.logout}> Log out! </button>
        // check if not logged in
        if(!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }
        //check if they own the store
        if(this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p> Sorry you aren't the owner of this store</p>
                    {logoutButton}
                </div>
            )
        }

        return (
            <div>
                <h2> Inventory </h2>
                {logoutButton}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.loadSamples}> Load sample fish
                    </button>
            </div>
        )
    }
}


export default Inventory;
