import axios from "axios";
import dotenv from "dotenv";
import axiosRetry from 'axios-retry'
import http from 'http'
import https from 'https'
dotenv.config();

class Communicator {
    constructor() {

      const httpAgent = new http.Agent({ 
        keepAlive: true, 
        maxSockets: 50, 
        maxFreeSockets: 10 
      });
      const httpsAgent = new https.Agent({ 
        keepAlive: true, 
        maxSockets: 50, 
        maxFreeSockets: 10 
      });
  
      this.authServiceClient = axios.create({ 
        baseURL: `https://authentication-microservice-42th.onrender.com/api`, 
        httpAgent, 
        httpsAgent, 
        timeout: 60000 
      });
      this.productServiceClient = axios.create({ 
        baseURL: `https://products-microservice-6x1u.onrender.com/api`, 
        httpAgent, 
        httpsAgent, 
        timeout: 60000 
      });
      this.orderServiceClient = axios.create({ 
        baseURL: `https://orders-microservice-dhtc.onrender.com/api`, 
        httpAgent, 
        httpsAgent, 
        timeout: 60000 
      });
      this.notificationServiceClient = axios.create({ 
        baseURL: `https://notifications-microservice-mpxx.onrender.com/api`, 
        httpAgent, 
        httpsAgent, 
        timeout: 60000 
      });
  
      // Configure retry logic for all clients
      this.configureRetry(this.authServiceClient, 'authServiceClient');
      this.configureRetry(this.productServiceClient, 'productServiceClient');
      this.configureRetry(this.orderServiceClient, 'orderServiceClient');
      this.configureRetry(this.notificationServiceClient, 'notificationServiceClient');
    }
  
    configureRetry(client, serviceName) {
      axiosRetry(client, { 
        retries: 3,
        retryDelay: (retryCount) => {
          console.log(`Retry attempt for ${serviceName}: ${retryCount}`);
          return retryCount * 2000; // Exponential backoff
        },
        retryCondition: (error) => {
          return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || !error.response;
        },
        onRetry: (retryCount, error, requestConfig) => {
          console.log(`Retrying ${serviceName} request: ${retryCount}`, error.message);
        }
      });
    }
  //authentication service communication
  async authTest(){
    const response = await  this.authServiceClient.get('/test');
    return response.data;
  }
    async  signIn(email, password) {
        const response = await this.authServiceClient.post('/signin', { email, password }).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
      }
      
    async  signUp( password, email, name, role) {
        const response = await this.authServiceClient.post('/signup', { password, email, name, role }).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
      }
      
    async  logout() {
        const response = await this.authServiceClient.post('/logout').catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );;
        return response.data;
      }
    async  refreshToken(token) {
        const response = await this.authServiceClient.post('/refreshToken', { token }).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    async  verifyToken(token) {
        const response = await this.authServiceClient.post('/verifyToken', { token }).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    async getUsers() {
        const response = await this.authServiceClient.get('/getUsers').catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    async getUser(user_id) {
        const response = await this.authServiceClient.get(`/getUser/${user_id}`).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
            throw error;
          }
          
        );
        return response.data;

      }
      async updateUser(user_id, user) {
        const response = await this.authServiceClient.put('/updateUser', {user_id, user}).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
      }

      async deleteUser(user_id, role) {
        const response = await this.authServiceClient.post('/deleteUser', {user_id, role}).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
      }

    //product service communication
    async  addProduct(seller_id, title, description, price, stock_quantity, category,image) {
        const response = await this.productServiceClient.post('/addProduct', {seller_id, title, description, price, stock_quantity, category,image}).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
      }
    async  updateProduct(product_id, product) {
        const response = await this.productServiceClient.put('/updateProduct', {product, product_id}).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    async  deleteProduct(product_id) {
        const response = await this.productServiceClient.delete(`/deleteProduct/${product_id}`).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }

    async  getProducts() {
        const response = await this.productServiceClient.get('/getProducts').catch(
          function (error) {
            console.error('Error in getProducts:', error);
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    

    async  getProductsBySeller(seller_id) {
      const response = await this.productServiceClient.get(`/getProductsBySeller/${seller_id}`).catch(
        function (error){
          if(error.response){
            throw new Error(`${error.response.data.msg}`);
          }
        }
      )
      return response.data;
    }
    async  getProduct(product_id) {
        const response = await this.productServiceClient.get(`/getProduct/${product_id}`).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }

    async getProductsByCategory(category) {
      const response = await this.productServiceClient.get(`/getProductsByCategory/${category}`).catch(
        function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`error: ${error.response.data.msg}`);
           
          } 
        }
      );
      return response.data;
    }
    async getProductImage(id) {
      const response = await this.productServiceClient.get(`/getProductImage/${id}`, {responseType: 'arraybuffer'}).catch(
        function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`error: ${error.response.data.msg}`);
           
          } 
        }
      );
      return response.data;
    }

    async getAvailableCategories(){
      const response = await this.productServiceClient.get('/getAvailableCategories').catch(
        function (error){
          if(error.response){
            throw new Error(`${error.response.data.msg}`);
            
          }
        }
      )
      return response.data
    }

    async getAllCategories(){
      const response = await this.productServiceClient.get('/getAllCategories').catch(
        function(error){
          if(error.response){
            throw new Error(`${error.response.data.msg}`);
          }
        }
      )
      return response.data
    }
    async getTopProducts(){
      const response = await this.productServiceClient.get('/getTopProducts').catch(
        function(error){
          if(error.response){
            throw new Error(`${error.response.data.msg}`);
          }
        }
      )
      return response.data
    }

    async deleteSellersProducts(user_id){
      const response = await this.productServiceClient.delete(`/deleteSellersProduct/${user_id}`).catch(
        function (error){
          if(error.response){
            throw new Error(`${error.response.data.msg}`);
          }
        }
      )
      return response.data
      
    }





  //order service communication
  async  placeOrder(order) {
    const response = await this.orderServiceClient.post('/placeOrder', {order}).catch(
      function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(`error: ${error.response.data.msg}`);
         
        } 
      }
    );
    return response.data;
  }
    async  updateOrder(order_id,order) {
        const response = await this.orderServiceClient.put('/updateOrder', {order_id,order}).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    async updateUserOrders(user_id, order) {
      const response = await this.orderServiceClient.put('/updateUserOrders', {user_id, order}).catch(
        function (error) {
          if(error.response){
            throw new Error(`${error.response.data.msg}`);
          }
        }
      );
      return response.data;
    }

    async  cancelOrder(order_id) {
        const response = await this.orderServiceClient.patch('/cancelOrder', { order_id }).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }

    async  getOrders(user_id) {
        const response = await this.orderServiceClient.post('/getUserOrders', { user_id }).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }
    async  getOrder(order_id) {
        const response = await this.orderServiceClient.get(`/getOrder/${order_id}`).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            } 
          }
        );
        return response.data;
    }

    async  getOrdersBySeller(seller_id) {
      const response = await this.orderServiceClient.get(`/getOrdersBySeller/${seller_id}`).catch(
        function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`error: ${error.response.data.msg}`);
           
          } 
        }
      )
      return response.data;
    }

    //notification service communication
    async  sendNotification(user_id, subject, message) {
        const response = await this.notificationServiceClient.post('/sendNotification', {user_id,subject,message}).catch(
          function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              throw new Error(`error: ${error.response.data.msg}`);
             
            }
            // throw error;
          }
        );
        return response.data;
      }




}
export default new Communicator();