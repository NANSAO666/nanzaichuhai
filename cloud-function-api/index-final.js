exports.main = async (event, context) => {
  const db = uniCloud.database();
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true })
    };
  }

  let params = {};
  
  if (event.body && typeof event.body === 'string') {
    try {
      params = JSON.parse(event.body);
    } catch (e) {
      console.error('解析body失败', e);
    }
  }
  
  const { action, collection, data, where, field, limit, skip, orderby, id } = params;

  try {
    let result;

    switch (action) {
      case 'select':
      case 'query':
      case 'get': {
        let dbQuery = db.collection(collection);
        if (where && Object.keys(where).length > 0) {
          dbQuery = dbQuery.where(where);
        }
        if (field) {
          dbQuery = dbQuery.field(field);
        }
        if (orderby) {
          dbQuery = dbQuery.orderBy(orderby);
        }
        if (skip) {
          dbQuery = dbQuery.skip(skip);
        }
        if (limit) {
          dbQuery = dbQuery.limit(limit);
        }
        result = await dbQuery.get();
        return {
          isBase64Encoded: false,
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            success: true,
            data: result.data,
            count: result.result ? result.result.count : undefined
          })
        };
      }

      case 'add':
      case 'insert': {
        const addResult = await db.collection(collection).add(data);
        return {
          isBase64Encoded: false,
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            success: true,
            id: addResult.id,
            _id: addResult.id
          })
        };
      }

      case 'update': {
        let updateQuery = db.collection(collection);
        if (id) {
          updateQuery = updateQuery.doc(id);
        } else if (where) {
          updateQuery = updateQuery.where(where);
        }
        const updateResult = await updateQuery.update(data);
        return {
          isBase64Encoded: false,
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            success: true,
            updated: updateResult.updated
          })
        };
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
        return {
          isBase64Encoded: false,
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            success: true,
            deleted: removeResult.deleted
          })
        };
      }

      case 'count': {
        let countQuery = db.collection(collection);
        if (where && Object.keys(where).length > 0) {
          countQuery = countQuery.where(where);
        }
        const countResult = await countQuery.count();
        return {
          isBase64Encoded: false,
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            success: true,
            total: countResult.total
          })
        };
      }

      default:
        return {
          isBase64Encoded: false,
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Content-Disposition': 'inline'
          },
          body: JSON.stringify({
            success: false,
            error: '未知的action: ' + action
          })
        };
    }
  } catch (e) {
    console.error('数据库操作失败', e);
    return {
      isBase64Encoded: false,
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
