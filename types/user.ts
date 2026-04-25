export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  photo: string;
  country: string;
  city: string;
  address: string;
};

export type RandomUserResponse = {
  results: {
    login: {
      uuid: string;
    };
    name: {
      first: string;
      last: string;
    };
    email: string;
    phone: string;
    dob: {
      age: number;
    };
    picture: {
      large: string;
    };
    location: {
      country: string;
      city: string;
      street: {
        number: number;
        name: string;
      };
    };
  }[];
};
