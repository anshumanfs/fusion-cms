import axios from '@/lib/axios';
import dataJson from './data.json';

const callApi = async (payload: any) => {
  const res = await axios.post('/appManager', payload);
  const { data, errors } = res.data;
  if (errors) {
    console.log(errors);
    return [];
  }
  return data;
};

const fetchUsersData = async (page: number = 0) => {
  const payload = JSON.stringify({
    query: `query GetUser($page: Int) {
      getUsers(page: $page) {
        _id
        firstName
        lastName
        email
        role
        createdAt
        updatedAt
      }
    }`,
    variables: {
      page: page + 1,
    },
  });
  const data = await callApi(payload);
  const allUsers: any = [];
  data.getUsers.forEach((user: any) => {
    allUsers.push({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      active: true,
      createdAt: user.createdAt,
    });
  });
  return allUsers;
  // page = page + 1;
  // return dataJson.slice((page - 1) * 10, page * 10);
};

const fetchUsersCount = async () => {
  const payload = JSON.stringify({
    query: `query GetUser {
      getUsersCount
    }`,
  });
  const data = await callApi(payload);
  return data.getUsersCount;
  //return dataJson.length;
};

const fetchUserById = async (id: string | number) => {
  const payload = JSON.stringify({
    query: `query GetUser($id: ID!) {
      getUser(id: $id) {
        _id
        firstName
        lastName
        email
        role
        createdAt
        updatedAt
      }
    }`,
    variables: {
      id: id,
    },
  });
  const data = await callApi(payload);
  return data.getUser;
};

export { fetchUsersData, fetchUsersCount, fetchUserById };
