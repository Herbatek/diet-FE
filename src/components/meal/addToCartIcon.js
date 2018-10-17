import {Icon} from "antd";
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {addMealToCart} from "../../actions";

class AddToCartIcon extends Component {
    render() {
        return (
            <span className='head__span' onClick={() => this.props.addMealToCart(this.props.mealId)}>
                <Icon type="shopping-cart" theme="outlined" style={{fontSize: '30px'}}/>
                Do koszyka
            </span>
        )
    }
}

export default connect(null, {addMealToCart})(AddToCartIcon);