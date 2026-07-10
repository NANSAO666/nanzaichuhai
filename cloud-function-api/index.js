'use strict';
const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  let params = {};
  
  if (event.body && typeof event.body === 'string') {
    try {
      params = JSON.parse(event.body);
    } catch (e) {}
  }
  
  const { action, collection, data, query, where, field, limit, skip, orderby, id } = params;

  try {
    let result;
    let responseData;

    switch (action) {
      case 'select':
      case 'query':
      case 'get': {
        let dbQuery = db.collection(collection);
        if (where && Object.keys(where).length > 0) {
          dbQuery = dbQuery.where(where);
        }
        if (field && field !== '*') {
          dbQuery = dbQuery.field(field);
        }
        if (orderby) {
          if (typeof orderby === 'string') {
            const parts = orderby.split(' ');
            dbQuery = dbQuery.orderBy(parts[0], parts[1] || 'asc');
          } else {
            dbQuery = dbQuery.orderBy(orderby);
          }
        }
        if (skip) {
          dbQuery = dbQuery.skip(skip);
        }
        if (limit) {
          dbQuery = dbQuery.limit(limit);
        }
        result = await dbQuery.get();
        responseData = {
          success: true,
          data: result.data,
          count: result.result ? result.result.count : undefined
        };
        break;
      }

      case 'add':
      case 'insert': {
        const addResult = await db.collection(collection).add(data);
        responseData = {
          success: true,
          id: addResult.id,
          _id: addResult.id
        };
        break;
      }

      case 'update': {
        let updateQuery = db.collection(collection);
        if (id) {
          updateQuery = updateQuery.doc(id);
        } else if (where) {
          updateQuery = updateQuery.where(where);
        }
        const updateResult = await updateQuery.update(data);
        responseData = {
          success: true,
          updated: updateResult.updated
        };
        break;
      }

      case 'remove':
      case 'delete': {
        let removeQuery = db.collection(collection);
        if (id) {
          removeQuery = removeQuery.doc(id);
        } else if (where) {
          removeQuery = removeQuery.where(where);
        }
        const removeResult = await removeQuery.remove();
        responseData = {
          success: true,
          deleted: removeResult.deleted
        };
        break;
      }

      case 'count': {
        let countQuery = db.collection(collection);
        if (where && Object.keys(where).length > 0) {
          countQuery = countQuery.where(where);
        }
        const countResult = await countQuery.count();
        responseData = {
          success: true,
          total: countResult.total
        };
        break;
      }

      default:
        responseData = {
          success: false,
          error: '未知的action: ' + action
        };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Content-Disposition': 'inline'
      },
      body: JSON.stringify(responseData)
    };
    
  } catch (e) {
    console.error('数据库操作失败', e);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Content-Disposition': 'inline'
      },
      body: JSON.stringify({
        success: false,
        error: e.message || '操作失败'
      })
    };
  }
};
