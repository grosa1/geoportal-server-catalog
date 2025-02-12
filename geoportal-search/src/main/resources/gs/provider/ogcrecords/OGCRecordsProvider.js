/* See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * Esri Inc. licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){

  gs.provider.ogcrecords.OGCRecordsProvider = gs.Object.create(gs.provider.Provider,{

    isSingleIdRequest: {writable: true, value: false},

    description: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var ogcRecordsUrl = task.baseUrl+"/ogcrecords"; 

      var qstr = "", url = task.request.url;
      var n = url.indexOf("?");
      if (n !== -1) qstr = url.substring(n + 1).trim();
      if (qstr.length > 0) qstr = "&"+qstr;

      var json = task.context.readResourceFile(task.config.ogcrecordsDescriptionFile,"UTF-8");
      json = json.trim();
      json = json.replace(/{opensearch.url}/g,task.val.escXml(ogcRecordsUrl));
      var response = task.response;
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,json);
      promise.resolve();
      return promise;
    }},

    conformance: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var response = task.response;
      var json = task.context.readResourceFile(task.config.ogcrecordsConformanceFile,"UTF-8");
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,json);
      promise.resolve();
      return promise;
    }},

    api: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var ogcRecordsUrl = task.baseUrl+"/ogcrecords"; 
      var response = task.response;
      var json = task.context.readResourceFile(task.config.ogcrecordsAPIFile,"UTF-8");
      json = json.trim();
      json = json.replace(/{opensearch.url}/g,task.val.escXml(ogcRecordsUrl));
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,json);
      promise.resolve();
      return promise;
    }},

    collections: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var ogcRecordsUrl = task.baseUrl+"/ogcrecords"; 
      var response = task.response;
      var json = task.context.readResourceFile(task.config.ogcrecordsCollectionsFile,"UTF-8");
      json = json.trim();
      json = json.replace(/{url}/g,task.val.escXml(ogcRecordsUrl));
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,json);
      promise.resolve();
      return promise;
    }},

    collection: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var ogcRecordsUrl = task.baseUrl+"/ogcrecords"; 
      var response = task.response;
      var json = task.context.readResourceFile(task.config.ogcrecordsCollectionMetadataFile,"UTF-8");
      json = json.trim();
      json = json.replace(/{url}/g,task.val.escXml(ogcRecordsUrl));
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,json);
      promise.resolve();
      return promise;
    }},

    items: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var ogcRecordsUrl = task.baseUrl+"/ogcrecords"; 
      var response = task.response;
      var json = task.context.readResourceFile(task.config.ogcrecordsItemsFile,"UTF-8");
      json = json.trim();
      json = json.replace(/{url}/g,task.val.escXml(ogcRecordsUrl));
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,json);
      promise.resolve();
      return promise;
    }},

    todo: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      var response = task.response;
      var v = task.request.getUrlPath();
      var json = {"request": v, "status":"TODO"};
      response.put(response.Status_OK,response.MediaType_APPLICATION_JSON,JSON.stringify(json));
      promise.resolve();
      return promise;
    }},

    execute: {writable:true,value:function(task) {
      var v = task.request.getUrlPath();
      
      if (task.val.endsWith(v,"/ogcrecords")) {
          return this.description(task);
      } else if (task.val.endsWith(v,"/ogcrecords/conformance")) {
          return this.conformance(task);
      } else if (task.val.endsWith(v,"/ogcrecords/api")) {
          return this.api(task);
      } else if (task.val.endsWith(v,"/ogcrecords/collections/metadata/queryables")) {
          return this.queryables(task);
      } else if (task.val.endsWith(v,"/ogcrecords/collections")) {
          return this.collections(task);
      } else if (task.val.endsWith(v,"/ogcrecords/collections/metadata")) {
          return this.collection(task);
      } else if (task.val.endsWith(v,"/collections/metadata/items")) {
          return this.items(task);
      } else {
          return this.todo(task);
      }
    }},

    search: {writable:true,value:function(task) {
      var promise = task.context.newPromise();
      task.request.parseF(task);
      this.setWriter(task);
      var isSingleIdRequest = this.isSingleIdRequest;
      task.target.search(task).then(function(searchResult){
        if (isSingleIdRequest && (!searchResult.items || searchResult.items.length === 0)) {
          // TODO is this error only for the CSW ets-cat30 test?
          var msg = "{\"error\": \"Id not found.\"}";
          task.response.put(task.response.Status_NOT_FOUND,task.response.MediaType_APPLICATION_JSON,msg);
          promise.resolve();
        } else {
          task.writer.write(task,searchResult);
          promise.resolve();
        }
      })["catch"](function(error){
        promise.reject(error);
      });
      return promise;
    }}

  });

}());
