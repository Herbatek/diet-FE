import AuthService from "../helpers/auth_service";
import SecuredRequest from "../helpers/secured_request";
import Request from "../helpers/request";
import {
    CREATE_MEAL,
    FETCH_MEAL,
    FETCH_MEALS,
    DELETE_MEAL,
    FETCH_MY_MEALS,
    FETCH_FAVOURITE_MEALS,
    IS_FAVOURITE_MEAL,
    ADD_MEAL_TO_FAVOURITES,
    REMOVE_MEAL_FROM_FAVOURITES,
    SEARCH_MEALS,
    EDIT_MEAL
} from "./index";

export function createMeal(values, callback) {
    const userId = AuthService.getDecodedToken().sub;
    const request = SecuredRequest.post(`/users/${userId}/meals`, values)
        .then(() => callback());

    return {
        type: CREATE_MEAL,
        payload: request
    }
}

export function deleteMeal(id, callback) {
    SecuredRequest.delete(`/meals/${id}`)
        .then(() => callback());

    return {
        type: DELETE_MEAL,
        payload: id
    }
}

export function fetchMeal(id) {
    const request = Request.get(`/meals/${id}`);

    return {
        type: FETCH_MEAL,
        payload: request
    }
}

export function fetchMeals(page, pageSize) {
    const request = Request.get(`/meals?page=${page}&size=${pageSize}`);

    return {
        type: FETCH_MEALS,
        payload: request
    }
}

export function fetchMyMeals(page, pageSize) {
    const userId = AuthService.getDecodedToken().sub;
    const request = Request.get(`/users/${userId}/meals?page=${page}&size=${pageSize}`);

    return {
        type: FETCH_MY_MEALS,
        payload: request
    }
}

export function searchMeals(query, page, pageSize) {
    const request = Request.get(`/meals/search?query=${query}&page=${page}&size=${pageSize}`);

    return {
        type: SEARCH_MEALS,
        payload: request
    }
}

export function fetchFavouriteMeals(page, pageSize) {
    const userId = AuthService.getDecodedToken().sub;
    const request = Request.get(`/users/${userId}/meals/favourites?page=${page}&size=${pageSize}`);

    return {
        type: FETCH_FAVOURITE_MEALS,
        payload: request
    }
}

export function isFavouriteMeal(mealId) {
    const userId = AuthService.getDecodedToken().sub;
    const request = SecuredRequest.get(`/users/${userId}/meals/${mealId}/favourites`);

    return {
        type: IS_FAVOURITE_MEAL,
        payload: request
    }
}

export function addMealToFavourites(mealId) {
    const userId = AuthService.getDecodedToken().sub;
    const request = SecuredRequest.post(`/users/${userId}/meals/${mealId}/favourites`);

    return {
        type: ADD_MEAL_TO_FAVOURITES,
        payload: request
    }
}

export function removeMealFromFavourites(mealId) {
    const userId = AuthService.getDecodedToken().sub;
    const request = SecuredRequest.delete(`/users/${userId}/meals/${mealId}/favourites`);

    return {
        type: REMOVE_MEAL_FROM_FAVOURITES,
        payload: request
    }
}

export function editMeal(update, callback) {
    const request = SecuredRequest.put(`/meals/${update.id}`, update)
        .then(() => callback());

    return {
        type: EDIT_MEAL,
        payload: request
    }
}