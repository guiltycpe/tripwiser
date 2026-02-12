const FACTS: Record<string, string[]> = {
    japan: [
        'Japan has over 6,800 islands but most people live on just 4 of them',
        'There are more pets than children in Japan',
        'Japan has over 5.5 million vending machines selling everything from hot soup to umbrellas',
        'The Japanese rail system is so punctual that delays of even 1 minute come with an apology',
        'Japan has 23 UNESCO World Heritage Sites'
    ],
    tokyo: [
        'Tokyo is the most populous metropolitan area in the world with over 37 million people',
        'The Tsukiji fish market handles over 2,000 tons of seafood daily',
        'Tokyo has more Michelin-starred restaurants than any other city in the world',
        'The famous Shibuya Crossing sees up to 3,000 people crossing at once'
    ],
    france: [
        'France is the most visited country in the world with over 89 million tourists per year',
        'The Louvre would take 100 days to see every piece for just 30 seconds each',
        'France has over 1,500 different types of cheese',
        'The Eiffel Tower was originally meant to be a temporary structure for 20 years'
    ],
    paris: [
        'Paris has 6,100 streets and the shortest one is just 5.75 meters long',
        'There are 37 bridges crossing the Seine in Paris',
        'The Paris Metro has 303 stations — more than any other European city',
        'Paris was the first city to open a public transportation system in 1662'
    ],
    italy: [
        'Italy has the most UNESCO World Heritage Sites of any country — 59',
        'Italians consume 26 kilos of pasta per person per year',
        'The University of Bologna, founded in 1088, is the oldest in the world',
        'There are over 3,000 islands in Italy'
    ],
    rome: [
        'Rome has been continuously inhabited for over 2,800 years',
        'People throw about €3,000 into the Trevi Fountain every day',
        'Rome has more fountains than any other city in the world — over 2,000',
        'The Colosseum could hold between 50,000 and 80,000 spectators'
    ],
    spain: [
        'Spain has the second-highest number of bars per capita in the world',
        'La Tomatina festival uses over 150,000 tomatoes every year',
        'Spain is the world\'s largest olive oil producer',
        'The Spanish steps are actually in Rome, not Spain'
    ],
    barcelona: [
        'La Sagrada Familia has been under construction since 1882',
        'Barcelona has 4.5 km of beaches right in the city center',
        'The city grid of L\'Eixample was designed so every corner gets sunlight',
        'Gaudí designed 7 buildings in Barcelona, all UNESCO-listed'
    ],
    usa: [
        'The USA spans 6 time zones including Alaska and Hawaii',
        'There are over 400 national parks and monuments in the US',
        'The US interstate highway system stretches over 48,000 miles',
        'The Grand Canyon is over 6 million years old'
    ],
    'new york': [
        'New York City has 840 miles of subway track',
        'Central Park is larger than the country of Monaco',
        'Over 800 languages are spoken in New York City',
        'The New York Public Library has over 53 million items'
    ],
    thailand: [
        'Thailand is the only Southeast Asian country never colonized by Europeans',
        'Bangkok\'s full ceremonial name is 168 characters long',
        'Thailand has over 40,000 Buddhist temples',
        'Thai cuisine is considered one of the world\'s healthiest'
    ],
    morocco: [
        'Morocco was the first country to recognize the United States in 1777',
        'The University of al-Qarawiyyin in Fez, founded in 859, is the oldest in the world',
        'Morocco produces over 100,000 tons of dates per year',
        'The Sahara Desert covers about 31% of Africa'
    ],
    greece: [
        'Greece has over 6,000 islands but only 227 are inhabited',
        'Athens is one of the oldest cities in the world — over 3,400 years old',
        'Greece has more archaeological museums than any other country',
        'The Greek language has been spoken for over 3,000 years'
    ],
    uk: [
        'London has 170 museums, many of which are free to visit',
        'The London Underground is the oldest metro system in the world, opened in 1863',
        'Big Ben actually refers to the bell inside, not the tower itself',
        'The UK has 33 UNESCO World Heritage Sites'
    ],
    london: [
        'London has over 3,000 parks and green spaces',
        'Over 300 languages are spoken in London',
        'The Thames has over 200 bridges and tunnels',
        'London was the first city to host the Olympics three times'
    ],
    portugal: [
        'Portugal is the oldest country in Europe with the same borders since 1249',
        'The Vasco da Gama Bridge in Lisbon is the longest in Europe at 17 km',
        'Portugal introduced tea-drinking to England through Catherine of Braganza',
        'The Portuguese Empire was the longest-lived European colonial empire'
    ],
    germany: [
        'Germany has over 1,500 different beers and 1,300 breweries',
        'Berlin is 9 times bigger than Paris in area',
        'Germany has over 20,000 castles and castle ruins',
        'The first printed book was produced in Germany by Gutenberg in 1440'
    ],
    mexico: [
        'Mexico City is sinking at a rate of about 20 inches per year',
        'Mexico introduced chocolate, chili peppers, and corn to the world',
        'Mexico has 35 UNESCO World Heritage Sites',
        'The Yucatan Peninsula was where the asteroid that killed the dinosaurs struck'
    ],
    australia: [
        'Australia is the only continent that is also a single country',
        'The Great Barrier Reef is visible from space',
        'Australia has over 10,000 beaches — you could visit a new one every day for 27 years',
        'The Australian Alps receive more snow than the Swiss Alps'
    ],
    canada: [
        'Canada has more lakes than all other countries combined',
        'The Trans-Canada Highway is over 7,800 km long',
        'Canada has the longest coastline of any country in the world',
        'Maple syrup production accounts for 71% of the world\'s supply'
    ],
    _default: [
        'The world has over 195 countries, each with unique traditions and cuisines',
        'Tourism accounts for about 10% of the world\'s GDP',
        'There are over 7,000 languages spoken around the world',
        'The most visited tourist attraction in the world is the Great Wall of China',
        'The average person will travel about 1.2 million miles in their lifetime',
        'There are 1,121 UNESCO World Heritage Sites across 167 countries',
        'The oldest known city in the world is Damascus, Syria — over 11,000 years old',
        'Air travel is statistically the safest form of transportation'
    ]
}

export function getFactsForDestination(destination: string): string[] {
    const lower = destination.toLowerCase()
    const key = Object.keys(FACTS).find(k => k !== '_default' && lower.includes(k))
    return FACTS[key || '_default'] ?? FACTS['_default'] ?? []
}
