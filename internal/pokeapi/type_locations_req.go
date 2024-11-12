package pokeapi

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func (c *Client) ListLocations(pageUrl *string) (Locations, error) {
	endpointUrl := "/location-area"
	fullUrl := baseUrl + endpointUrl
	if pageUrl != nil {
		fullUrl = *pageUrl
	}

	//check the cache
	data, ok := c.cache.Get(fullUrl)
	if ok {
		//found in cache
		locations := Locations{}
		err := json.Unmarshal(data, &locations)
		if err != nil {
			return Locations{}, err
		}
		return locations, nil
	}

	req, err := http.NewRequest("GET", fullUrl, nil)
	if err != nil {
		return Locations{}, err
	}

	res, err := c.httpClient.Do(req)
	if err != nil {
		return Locations{}, err
	}
	defer res.Body.Close()

	if res.StatusCode > 399 {
		return Locations{}, fmt.Errorf("bad status code: %v", res.StatusCode)
	}

	dat, err := io.ReadAll(res.Body)
	if err != nil {
		return Locations{}, err
	}

	locations := Locations{}
	err = json.Unmarshal(dat, &locations)
	if err != nil {
		return Locations{}, err
	}
	c.cache.Add(fullUrl, dat)

	return locations, nil
}
