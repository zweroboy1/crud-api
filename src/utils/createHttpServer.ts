import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, addUser, getUserById, updateUser, deleteUser } from '../usersStorage/userHandler';
import { sendResponse } from './sendResponse';
import { isUUIDv4 } from './isUUIDv4';
import { User } from '../types';

const parseJson = (jsonString: string): unknown | null => {
  try {
    const result = JSON.parse(jsonString);
    return result;
  } catch {
    return null;
  }
};

const validatedUser = (user: unknown): Omit<User, "id"> | null => {
  if (typeof user !== 'object' || !user || !('username' in user)
    || !('age' in user)
    || !('hobbies' in user)
    || typeof user.username !== 'string'
    || user.age != Number(user.age)
    || !Array.isArray(user.hobbies)
    || !user.hobbies.every((hobby: unknown) => typeof hobby === 'string')
  ) {
    return null;
  }
  return {
    username: user.username,
    age: Number(user.age),
    hobbies: user.hobbies
  }
};

export const createHttpServer = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  try {
    const { method, url } = request;

    if (!method || !url) {
      sendResponse(response, 400, 'Bad Request');
      return;
    }

    const pathSegments = url.split('/').filter(Boolean);
    if (pathSegments[0] !== 'api' || pathSegments[1] !== 'users' || pathSegments.length > 3) {
      sendResponse(response, 404, 'Page is Not Found');
      return;
    }

    if (pathSegments.length === 2) {
      if (method === 'GET') {
        const users = await getUsers();
        sendResponse(response, 200, JSON.stringify(users));
        return;
      }
      if (method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk;
        });
        request.on('end', async () => {
          const providedUserData = parseJson(body);
          if (!providedUserData) {
            sendResponse(response, 400, 'Wrong User Format (valid JSON is needed)');
            return;
          }
          const user = validatedUser(providedUserData);
          if (!user) {
            sendResponse(response, 400, 'Wrong User Format (we need only 3 fields - username(string), age(number), hobbies(array of strings))');
            return;
          }
          const newUser = await addUser(user);
          sendResponse(response, 201, JSON.stringify(newUser));
        });
      }
      return;
    }

    const userId = pathSegments[2];

    if (!isUUIDv4(userId)) {
      sendResponse(response, 400, 'Wrong format of userId (it should be uuid)');
      return;
    }

    if (method === 'GET') {
      const user = await getUserById(userId);
      if (user) {
        sendResponse(response, 200, JSON.stringify(user));
      } else {
        sendResponse(response, 404, 'User Is Not Found');
      }
      return;
    }

    if (method === 'DELETE') {
      const isUserDeleted = await deleteUser(userId);
      if (isUserDeleted) {
        sendResponse(response, 204, 'User was deleted');
      } else {
        sendResponse(response, 404, 'User Is Not Found');
      }
      return;
    }

    if (method === 'PUT') {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', async () => {
        const updatedData = JSON.parse(body);
        const updatedUser = await updateUser(userId, updatedData);
        if (updatedUser) {
          sendResponse(response, 200, JSON.stringify(updatedUser));
        } else {
          sendResponse(response, 404, 'User Not Found');
        }
      });
      return;
    }

    sendResponse(response, 405, 'Method not allowed for this endpoint');
  } catch (error) {
    sendResponse(response, 500, `Something goes wrong... ${error}`);
  }
};
