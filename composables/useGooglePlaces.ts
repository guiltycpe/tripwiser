// composables/useGooglePlaces.ts
import { onMounted, type Ref } from 'vue'

export function useGooglePlaces(
    // La ref de l'élément <input>
    inputRef: Ref<HTMLInputElement | null>,
    // Une fonction callback qui sera appelée quand l'utilisateur choisit un lieu
    onPlaceSelected: (place: google.maps.places.PlaceResult) => void
) {
    const { public: { googlePlacesApiKey } } = useRuntimeConfig()
    let autocomplete: google.maps.places.Autocomplete | null = null;

    // Charge le script de l'API Google Maps
    function loadGoogleScript() {
        if (window.google && window.google.maps) {
            initializeAutocomplete();
            return;
        }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesApiKey}&libraries=places`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        script.onload = initializeAutocomplete
    }

    // Initialise l'autocomplétion sur l'input
    function initializeAutocomplete() {
        if (!inputRef.value || typeof google === 'undefined' || !google.maps || !google.maps.places) {
            console.error("L'input ou l'API Google Places n'est pas prêt.");
            return
        }

        autocomplete = new google.maps.places.Autocomplete(inputRef.value, {
            types: ['(cities)'], // On ne veut que les villes
            fields: ['name', 'geometry'] // On demande le nom et les coordonnées
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete!.getPlace()
            if (place.geometry) {
                onPlaceSelected(place)
            }
        })
    }

    onMounted(loadGoogleScript);
}