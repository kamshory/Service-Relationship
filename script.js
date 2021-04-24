var trimArrowCache = {};
var messageSpecs = [];
var services = [];
var showservicerelation = true;
var showdatabase = true;
var showredis = true;
var jsonprettify = true;
var xmlprettify = true;
var autoclosedesc = true;

var objectWidth = 150;
var objectHeight = 50;
var horizontalSpace = 80;
var verticalSpace = 30;


function generateServiceDescription(service)
{
    var description = '';
    var table = '';
    if(service.alto_service)
    {
        table += '<table width=\"100%\">\r\n'+
        '<tbody>\r\n'+
        '    <tr><td>Repository</td><td>'+service.id+'</td></tr>\r\n'+
        '    <tr><td>Language</td><td>'+(service.language || '')+'</td></tr>\r\n'+
        '    <tr><td>Framework</td><td>'+(service.framework || '')+'</td></tr>\r\n'+
        '</tbody>\r\n'+
        '</table>\r\n';        
    }
    description = table+(service.description || '');
    return description;
}

function onClickService(e, id)
{
    clearTimeout(timeout);
    var service = getServiceByID(id);
    var cx = service.x + (service.width)/2;
    var cy = service.y + service.height;
    var offsetTop = document.querySelector('#svg1').offsetTop;
    var offsetLeft = document.querySelector('#svg1').offsetLeft;
    var svgWidth = parseFloat(document.querySelector('svg').getAttribute('width')) - 10;
    var description = generateServiceDescription(service);
    document.querySelector('#desc-title').innerHTML = service.label || service.id;
    document.querySelector('#desc-container').innerHTML = description;;

    var top = (cy+offsetTop+10);
    if(cy >= 500)
    {
        top = top - 550;
        document.querySelector('#desc').setAttribute('data-position', 'bottom');
    }
    else
    {
        document.querySelector('#desc').setAttribute('data-position', 'top');
    }
    var left = (offsetLeft);
    var pointerLeft = (cx-11);
    document.querySelector('#desc').style.width = svgWidth+'px';
    document.querySelector('#desc').style.left = left+"px";
    document.querySelector('#desc').style.top = top+"px";
    document.querySelector('.desc-pointer-top').style.left = pointerLeft+"px";            
    document.querySelector('.desc-pointer-bottom').style.left = pointerLeft+"px";            
    document.querySelector('#desc').style.display = "block"
}
function closeDesc()
{
    document.querySelector('#desc').style.display = "none"
}
function onHoverLine(id)
{
    var el2 = document.querySelector('#'+id);
    el2.setAttribute('stroke-width', '2.5');
}
function onOutLine(id)
{
    var el2 = document.querySelector('#'+id);
    el2.setAttribute('stroke-width', '1.8');
}
function onClickLine(id)
{
    clearTimeout(timeout);
    var spec = getSpecByID(id);
    var name_from = spec.from_name;
    var name_to = spec.to_name;
    var offsetTop = document.querySelector('#svg1').offsetTop;
    var offsetLeft = document.querySelector('#svg1').offsetLeft;
    var svgWidth = parseFloat(document.querySelector('svg').getAttribute('width')) - 10;

    var top = (spec.cy+offsetTop+10);
    if(spec.cy+offsetTop >= 500)
    {
        top = top - 500;
        document.querySelector('#desc').setAttribute('data-position', 'bottom');
    }
    else
    {
        document.querySelector('#desc').setAttribute('data-position', 'top');
    }
    var pointerLeft = (spec.cx-11);

    document.querySelector('#desc-title').innerHTML = 'From <strong>'+name_from+'</strong> to <strong>'+name_to+'</strong>'
    document.querySelector('#desc-container').innerHTML = generateSpec(spec);
    document.querySelector('#desc').style.width = svgWidth+'px';
    document.querySelector('#desc').style.left = (offsetLeft)+"px";
    document.querySelector('#desc').style.top = + top+"px";
    document.querySelector('.desc-pointer-top').style.left = pointerLeft+"px";            
    document.querySelector('.desc-pointer-bottom').style.left = pointerLeft+"px";            
    document.querySelector('#desc').style.display = "block";
}
function getCenter(points)
{
    var centerX = (points.x1 + points.x2) / 2;
    var centerY = (points.y1 + points.y2) / 2;
    return {x:centerX, y:centerY};
}
function getServiceByID(id)
{
    for (var i = 0; i < services.length; i++) 
    {
        if(services[i].id == id)
        {
            return services[i];
        }
    }
    return null;
}
function getSpecByID(id)
{
    for (var i = 0; i < messageSpecs.length; i++) 
    {
        if(messageSpecs[i].id == id)
        {
            return messageSpecs[i];
        }
    }
    return null;
}
function getOuterWidth(maxCol, width, marginWidth)
{
    return (maxCol * width) + ((maxCol -1) * marginWidth);
}
function getOuterHeight(maxRow, height, marginHeight)
{
    return (maxRow * height) + ((maxRow - 1) * marginHeight);
}
function createTube(cx, cy, width, height, id)
{
    var cy1 = cy - (height/3);
    var cy2 = cy + (height/3);
    var height1 = height/8;
    var height2 = Math.abs(cy2 - cy1);
    var height3 = height2 - 1;
    var width1 = width/2;
    var x1 = cx - (width/2);
    var x2 = cx + (width/2);
    var tube = 
    '<g id="'+id+'" onclick="javascript:onClickService(this, \''+id+'\')" filter="url(#shadow-filter)">\r\n'+
    '<ellipse cx="'+cx+'" cy="'+cy2+'" rx="'+width1+'" ry="'+height1+'" stroke="#555555" fill="#fff" />'+
    '<rect height="'+height3+'" width="'+width+'" y="'+cy1+'" x="'+x1+'" opacity="1" stroke="#FFFFFF" fill="#FFFFFF" />'+
    '<line stroke-linecap="undefined" stroke-width="1" stroke-linejoin="undefined" x1="'+x1+'" x2="'+x1+'" y1="'+cy1+'" y2="'+cy2+'" opacity="1" stroke="#555555" fill="none"/>\r\n'+
    '<line stroke-linecap="undefined" stroke-width="1" stroke-linejoin="undefined" x1="'+x2+'" x2="'+x2+'" y1="'+cy1+'" y2="'+cy2+'" opacity="1" stroke="#555555" fill="none"/>\r\n'+
    '<ellipse cx="'+cx+'" cy="'+cy1+'" rx="'+width1+'" ry="'+height1+'" stroke="#555555" fill="#fff" />\r\n'+
    '</g>';
    return tube;
}
function getMinMax(arr) {
    var min = arr[0];
    var max = arr[0];
    var i = arr.length;
      
    while (i--) {
      min = arr[i] < min ? arr[i] : min;
      max = arr[i] > max ? arr[i] : max;
    }
    return { min:min, max:max };
}
function getAutoRowColumn(elements, col)
{
    if(typeof elements[col] == 'undefined')
    {
        return 0;
    }
    var numRow = 0;
    for(var i in elements[col])
    {
        if(elements[col][i].autorow)
        {
            numRow++;
        }
    }
    return numRow;
}
function drawSVG()
{
    trimArrowCache = {};
    messageSpecs = JSON.parse(JSON.stringify(messageSpecsSource));
    services = JSON.parse(JSON.stringify(servicesSource));

    var elements = createGroup(services);
    var maxRows = getMaxRow(elements);


    var key;
    var height = parseFloat(objectHeight);
    var width = parseFloat(objectWidth);
    var marginHeight = parseFloat(verticalSpace);
    var marginWidth = parseFloat(horizontalSpace);
    var maxCols = 0;
    var cols = [];
    for (key in elements) 
    {
        if (elements.hasOwnProperty(key)) 
        {
            cols.push(parseInt(key));
        }
    }
    var minMax = getMinMax(cols);
    var minCol = minMax.min;
    var maxCol = minMax.max;
    maxCols = (maxCol - minCol) + 1;

    var svgHeight = getOuterHeight(maxRows, height, marginHeight) + 10;
    var svgWidth = getOuterWidth(maxCols, width, marginWidth) + 10;

    var colHeight = {};
    for (key in elements) 
    {
        if (elements.hasOwnProperty(key)) 
        {
            var h = getAutoRowColumn(elements, key);
            colHeight[key] = getOuterHeight(h, height, marginHeight);
        }
    }
    var filter = "\r\n"
    + "    <filter x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\" filterUnits=\"objectBoundingBox\" id=\"shadow-filter\">\r\n"
    + "        <feOffset dx=\"4\" dy=\"4\" in=\"SourceAlpha\" result=\"shadowOffsetOuter1\"/>\r\n"
    + "        <feGaussianBlur stdDeviation=\"3\" in=\"shadowOffsetOuter1\" result=\"shadowBlurOuter1\"/>\r\n"
    + "        <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.14 0\" in=\"shadowBlurOuter1\" type=\"matrix\" result=\"shadowMatrixOuter1\"/>\r\n"
    + "        <feMerge>\r\n"
    + "        <feMergeNode in=\"shadowMatrixOuter1\"/>\r\n"
    + "        <feMergeNode in=\"SourceGraphic\"/>\r\n"
    + "        </feMerge>\r\n"
    + "    </filter>\r\n";
    var marker =     
    '  <marker id="arrowhead1" markerWidth="8" markerHeight="7" \r\n'+
    '  refX="8" refY="3.5" orient="auto">\r\n'+
    '    <polygon points="0 0, 9 3.5, 0 7" fill="#555555" />\r\n'+
    '  </marker>\r\n'+
    '  <marker id="arrowhead2" markerWidth="8" markerHeight="7" \r\n'+
    '  refX="8" refY="3.5" orient="auto" >\r\n'+
    '    <polygon points="0 0, 9 3.5, 0 7" fill="#33AA44" />\r\n'+
    '  </marker>\r\n'+
    '  <marker id="arrowhead3" markerWidth="8" markerHeight="7" \r\n'+
    '  refX="8" refY="3.5" orient="auto" >\r\n'+
    '    <polygon points="0 0, 9 3.5, 0 7" fill="#3344AA" />\r\n'+
    '  </marker>\r\n'
    ;

    //
    var svgHeader = 
    '<svg width="'+svgWidth+'" height="'+svgHeight+'" xmlns="http://www.w3.org/2000/svg">\r\n'+
    '<defs>\r\n'+
    filter+marker+
    '</defs>\r\n'+
    '<g>\r\n';


    var svgFooter = 
    '</g>\r\n'+
    '</svg>\r\n';
    var i;
    var svgService = '';
    var service;
    for (key in elements) 
    {
        if (elements.hasOwnProperty(key)) 
        {
            service = elements[key];
            for(i in service)
            {
                var yOffset = (svgHeight - colHeight[key]) / 2;
                var column = parseFloat(service[i].column);
                var id = service[i].id;
                var label = service[i].label || id;
                var itemWidth = width;
                var itemHeight = height;
                var x = (parseInt(column) - 1) * (width + marginWidth);
                var row = parseInt(service[i].row || '1') - 1;
                var y = (row * (height + marginHeight));
                if(service[i].autorow)
                {
                    y += yOffset;
                }
                else
                {
                    y += 5;
                }

                var centerX = x + (itemWidth/2);
                var centerY = y + (itemHeight/2);
                if(service[i].type == 'tube')
                {
                    if(showdatabase)
                    {
                        svgService += createTube(x + (width/2), y + (height/2), width/1.5, height, id);
                        svgService += '<text onclick="javascript:onClickService(this, \''+id+'\')" x="'+centerX+'" y="'+centerY+'" dominant-baseline="middle" text-anchor="middle" text-anchor="middle" font-family="Tahoma" font-size="13px">'+label+'</text>\r\n';    
                        addServiceInfo(id, x+(width/6), y, itemWidth/1.5, itemHeight);
                    }
                }
                else if(service[i].type == 'ellipse')
                {
                    if(showredis)
                    {
                        svgService += '<ellipse id="'+id+'" onclick="javascript:onClickService(this, \''+id+'\')" cx="'+(x + (width/2))+'" cy="'+(y+(height/2))+'" rx="'+((width/2))+'" ry="'+(height/2)+'" stroke="#555555" fill="#fff" filter="url(#shadow-filter)" />\r\n';
                        svgService += '<text onclick="javascript:onClickService(this, \''+id+'\')" x="'+centerX+'" y="'+centerY+'" dominant-baseline="middle" text-anchor="middle" text-anchor="middle" font-family="Tahoma" font-size="13px">'+label+'</text>\r\n';    
                        addServiceInfo(id, x, y, itemWidth, itemHeight);
                    }
                }
                else
                {
                    svgService += '<rect id="'+id+'" onclick="javascript:onClickService(this, \''+id+'\')" height="'+itemHeight+'" width="'+itemWidth+'" y="'+y+'" x="'+x+'" opacity="1" stroke="#555555" fill="#fff" filter="url(#shadow-filter)" />\r\n';
                    svgService += '<text onclick="javascript:onClickService(this, \''+id+'\')" x="'+centerX+'" y="'+centerY+'" dominant-baseline="middle" text-anchor="middle" text-anchor="middle" font-family="Tahoma" font-size="13px">'+label+'</text>\r\n';    
                    addServiceInfo(id, x, y, itemWidth, itemHeight);
                }
            }
        }
    }

    var svgRelation = '';
    for (i = 0; i < messageSpecs.length; i++) 
    {

        var rel = messageSpecs[i];
        var objFrom = getServiceByID(rel.from);
        var objTo = getServiceByID(rel.to);
        if(objFrom != null && objTo != null)
        {
            var hasCallback = isHasCallback(rel);
            var trimArrow = 0;
            var trimArrowVal = 0;
            messageSpecs[i].from_name = objFrom.label || objFrom.id;
            messageSpecs[i].to_name = objTo.label || objTo.id;
            if(hasCallback)
            {
                trimArrow = getTrimArrow(rel.from, rel.to);
                if(trimArrow == 0)
                {
                    trimArrowVal = -12;
                }
                else
                {
                    trimArrowVal = 12;
                }
            }
            if(objFrom != null && objTo != null)
            {
                var x1 = 0;
                var x2 = 0;
                var y1 = 0;
                var y2 = 0;
                if(parseInt(objFrom.column) == parseInt(objTo.column))
                {
                    if(objFrom.y < objTo.y)
                    {
                        x1 = objFrom.x + (objFrom.width / 2);
                        y1 = objFrom.y + (objFrom.height);
                        x2 = objTo.x + (objTo.width / 2);
                        y2 = objTo.y;

                        x1 += trimArrowVal;
                        x2 += trimArrowVal;
                    }
                    else
                    {
                        x1 = objFrom.x + (objFrom.width /2);
                        y1 = objFrom.y;
                        x2 = objTo.x + (objTo.width /2);                           
                        y2 = objTo.y + objTo.height;

                        x1 += trimArrowVal;
                        x2 += trimArrowVal;
                    }
                }
                else if(parseInt(objFrom.column) < parseInt(objTo.column))
                {
                    x1 = objFrom.x + objFrom.width;
                    y1 = objFrom.y + (objFrom.height / 2);
                    x2 = objTo.x;
                    y2 = objTo.y + (objTo.height / 2);

                    y1 += trimArrowVal;
                    y2 += trimArrowVal;
                }
                else
                {
                    x1 = objFrom.x;
                    y1 = objFrom.y + (objFrom.height / 2);
                    x2 = objTo.x + objTo.width;                           
                    y2 = objTo.y + (objTo.height / 2);

                    y1 += trimArrowVal;
                    y2 += trimArrowVal;
                }

                id = 'rel-' + rel.from + '-' + rel.to;
                messageSpecs[i].id = id;
                messageSpecs[i].x1 = x1;
                messageSpecs[i].x2 = x2;
                messageSpecs[i].y1 = y1;
                messageSpecs[i].y2 = y2;

                messageSpecs[i].cx = (x1 + x2)/2;
                messageSpecs[i].cy = (y1 + y2)/2;
                if(objTo.type == 'tube')
                {
                    if(showdatabase)
                    {
                        svgRelation += '<line onclick="javascript:onClickLine(\''+id+'\')" onmouseover="javascript:onHoverLine(\''+id+'\')" onmouseout="javascript:onOutLine(\''+id+'\')" marker-end="url(#arrowhead2)" stroke-linecap="undefined" stroke-width="1.8" stroke-linejoin="undefined" id="'+id+'" y2="'+y2+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" opacity="1" stroke="#33AA44" fill="none"/>\r\n';
                    }
                }
                else if(objTo.type == 'ellipse')
                {
                    if(showredis)
                    {
                        svgRelation += '<line onclick="javascript:onClickLine(\''+id+'\')" onmouseover="javascript:onHoverLine(\''+id+'\')" onmouseout="javascript:onOutLine(\''+id+'\')" marker-end="url(#arrowhead3)" stroke-linecap="undefined" stroke-width="1.8" stroke-linejoin="undefined" id="'+id+'" y2="'+y2+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" opacity="1" stroke="#3344AA" fill="none"/>\r\n';
                    }
                }
                else
                {
                    if(showservicerelation)
                    {
                        svgRelation += '<line onclick="javascript:onClickLine(\''+id+'\')" onmouseover="javascript:onHoverLine(\''+id+'\')" onmouseout="javascript:onOutLine(\''+id+'\')" marker-end="url(#arrowhead1)" stroke-linecap="undefined" stroke-width="1.8" stroke-linejoin="undefined" id="'+id+'" y2="'+y2+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" opacity="1" stroke="#555555" fill="none"/>\r\n';
                    }
                }
            }
        }
    
    
    }

    
    return svgHeader + svgRelation + svgService + svgFooter;

}
function getTrimArrow(from, to)
{
    var trm = 0;
    if(typeof trimArrowCache[from+'-'+to] != 'undefined' || typeof trimArrowCache[to+'-'+from] != 'undefined')
    {
        trm++;
    }
    trimArrowCache[from+'-'+to] = trm;
    trimArrowCache[to+'-'+from] = trm;
    return trm;
}
function isHasCallback(rel)
{
    var i;
    for (i = 0; i < messageSpecs.length; i++) 
    {
        var rel2 = messageSpecs[i];
        if(rel2.from == rel.to && rel2.to == rel.from)
        {
            return true;
        }
    }
    return false;
}
function addServiceInfo(id, x, y, itemWidth, itemHeight)
{
    var length = services.length;
    for(var i = 0; i<length; i++)
    {
        if(services[i].id == id)
        {
            services[i].x = x;
            services[i].y = y;
            services[i].width = itemWidth;
            services[i].height = itemHeight;
        }
    }
}
function getMaxRow(elements)
{
    var max = 0;
    for (var i in elements) 
    {
        if (elements.hasOwnProperty(i)) {
            if(elements[i].length > max)
            {
                max = elements[i].length;
            }
        }
    }
    
    return max;
}
function createGroup(servicesAll)
{
    var length = servicesAll.length;
    var groups = {};
    var rows = {};
    for(var i = 0; i<length; i++)
    {
        var column = servicesAll[i].column;
        if(typeof rows[column] == 'undefined')
        {
            rows[column] = 0;
        }
        if(typeof groups[column] == 'undefined')
        {
            groups[column] = [];
        }
        var item = JSON.parse(JSON.stringify(servicesAll[i]));
        item.index = groups[column].length;     
        if(typeof item.row == 'undefined')
        {
            item.row = rows[column] + 1;
            item.autorow = true;
            rows[column]++;
        } 
        else
        {
            item.autorow = false;
        }
        groups[column].push(item);
    }
    return groups;
}
function htmlSpecialChars(input)
{
    input = input || '';
    return input.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
function removeContentLength(headers)
{
    var hdr = [];
    for(var i = 0; i<headers.length; i++)
    {
        if(headers[i].toLowerCase().indexOf('content-length:') == -1)
        {
            hdr.push(headers[i]);
        }
    }
    return hdr;
}
function removeHost(headers)
{
    var hdr = [];
    for(var i = 0; i<headers.length; i++)
    {
        if(headers[i].toLowerCase().indexOf('host:') == -1)
        {
            hdr.push(headers[i]);
        }
    }
    return hdr;
}
function getHeaderValue(headers, name)
{
    
    for(var i = 0; i<headers.length; i++)
    {
        if(headers[i].toLowerCase().indexOf(name.toLowerCase()+': ') == 0)
        {
            return headers[i].split(': ')[1] || '';
        }
    }
    return '';
}
function createRequest(specItem)
{
    var path = specItem.path || '/';
    if(typeof specItem.path_argument != 'undefined')
    {
        if(specItem.path_argument.length > 0)
        {
            if(path.indexOf('?') == -1)
            {
                path += '?';
            }
            path += specItem.path_argument || '';
        }
    }
    var host = specItem.host || '';
    if(((specItem.ssl && specItem.port != 443) || (!specItem.ssl && specItem.port != 80)) && host.indexOf(':') == -1)
    {
        host += ':'+specItem.port;
    }
    var headers = JSON.parse(JSON.stringify(specItem.request_header || []));
    var body = specItem.request_body || '';
    var contentType = getHeaderValue(headers, 'content-type');
    if(jsonprettify && contentType.indexOf('json'))
    {
        try{
            body = JSON.stringify(JSON.parse(body), undefined, 4);
        }
        catch(e)
        {
            body = specItem.request_body || '';
        }
    }
    if(xmlprettify && contentType.indexOf('xml'))
    {
        try{
            body = vkbeautify.xml(body, 4);
        }
        catch(e)
        {
            body = specItem.request_body || '';
        }
    }

    headers = removeContentLength(headers);
    headers = removeHost(headers);
    headers.push('Host: '+host);
    headers.push('Content-length: '+body.length);
    if(specItem.method == 'POST' || specItem.method == 'PUT')
    {
        headers.push('Content-length: '+body.length);
        return headers.join('\r\n')+'\r\n\r\n'+body;
    }
    else
    {
        return headers.join('\r\n');
    }
}
function createResponse(specItem)
{
    var headers = JSON.parse(JSON.stringify(specItem.response_header || []));
    headers = removeContentLength(headers);
    headers.unshift('HTTP/1.1 200 OK');

    var body = specItem.response_body || '';
    var contentType = getHeaderValue(headers, 'content-type');
    if(jsonprettify && contentType.indexOf('json'))
    {
        try{
            body = JSON.stringify(JSON.parse(body), undefined, 4);
        }
        catch(e)
        {
            body = specItem.response_body || '';
        }
    }
    if(xmlprettify && contentType.indexOf('xml'))
    {
        try{
            body = vkbeautify.xml(body, 4);
        }
        catch(e)
        {
            body = specItem.request_body || '';
        }
    }
    if(specItem.method == 'POST' || specItem.method == 'PUT')
    {
        headers.push('Content-length: '+body.length);
        return headers.join('\r\n')+'\r\n\r\n'+body;
    }
    else
    {
        return headers.join('\r\n');
    }
}

function generateSpecHeader(spec)
{
    if(typeof spec == 'undefined' || typeof spec.protocol == 'undefined')
    {
        return '';
    }
    var s = "<div class=\"desc-header\">\r\n"
    + "    <table>\r\n"
    + "        <tbody>\r\n"
    + "            <tr>\r\n"
    + "                <td>Protocol</td>\r\n"
    + "                <td>"+(spec.protocol || '')+"</td>\r\n"
    + "            </tr>\r\n"
    + "            <tr>\r\n"
    + "                <td>Connection</td>\r\n"
    + "                <td>"+(spec.connection || '')+"</td>\r\n"
    + "            </tr>\r\n"
    + "            <tr>\r\n"
    + "                <td>Description</td>\r\n"
    + "                <td>"+(spec.description || '')+"</td>\r\n"
    + "            </tr>\r\n"
    + "        </tbody>\r\n"
    + "    </table>\r\n"
    + "</div>\r\n";
    return s;
}
function generateSpec(spec)
{
    if(typeof spec == 'undefined')
    {
        return '';
    }
    if(typeof spec.protocol != 'undefined')
    {
        if(spec.protocol.toUpperCase() == 'HTTP')
        {
            return generateSpecHeader(spec)+generateHTTPSpecContent(spec);
        }
        else if(spec.protocol.toUpperCase() == 'ISO8583')
        {
            return generateSpecHeader(spec)+generateISO8583Spec(spec);
        }
    }
    else
    {
        
        return spec.description || ''
    }
}
function generateISO8583Spec(spec)
{
    var items = '';
    if(typeof spec.specs != 'undefined')
    {
        for(var i = 0; i<spec.specs.length; i++)
        {
            items += generateISOSpecContentItem(spec.specs[i]);
        }
    }
    var html = '<div class="desc-content">'+items+'</div>';
    return html;
}
function generateISOSpecContentItem(specItem)
{

    var label = htmlSpecialChars(specItem.label);
    var request_body = htmlSpecialChars(specItem.request_body);
    var response_body = htmlSpecialChars(specItem.response_body);
    var tlv_field_request =(typeof specItem.tlv_field_request != 'undefined')?specItem.tlv_field_request.join(','):'';
    var tlv_field_response =(typeof specItem.tlv_field_response != 'undefined')?specItem.tlv_field_response.join(','):'';
    var result = "<h2>"+label+"</h2>\r\n"
    + "<h3>Request</h3>\r\n"
    + "<div class=\"iso-container\" data-tlv=\""+tlv_field_request+"\">\r\n"
    + "    <div class=\"iso-message-container\">\r\n"
    + "        <div class=\"form-control-wrapper\">\r\n"
    + "            <textarea spellcheck=\"false\" name=\"iso\" class=\"iso\" rows=\"4\">"+request_body+"</textarea>\r\n"
    + "        </div>\r\n"
    + "        <div class=\"form-control-wrapper\">\r\n"
    + "            <input type=\"button\" value=\"Parse\" id=\"parse\" onclick=\"parseISOMessage(this)\">\r\n"
    + "        </div>\r\n"
    + "    </div>\r\n"
    + "    <div class=\"iso-data-container\">           \r\n"
    + "    </div>\r\n"
    + "    <div class=\"tlv-data-container\">\r\n"
    + "    </div>          \r\n"
    + "</div>\r\n"
    + "\r\n"
    + "<h3>Response</h3>\r\n"
    + "<div class=\"iso-container\" data-tlv=\""+tlv_field_response+"\">\r\n"
    + "    <div class=\"iso-message-container\">\r\n"
    + "        <div class=\"form-control-wrapper\">\r\n"
    + "            <textarea spellcheck=\"false\" name=\"iso\" class=\"iso\" rows=\"4\">"+response_body+"</textarea>\r\n"
    + "        </div>\r\n"
    + "        <div class=\"form-control-wrapper\">\r\n"
    + "            <input type=\"button\" value=\"Parse\" id=\"parse\" onclick=\"parseISOMessage(this)\">\r\n"
    + "        </div>\r\n"
    + "    </div>\r\n"
    + "    <div class=\"iso-data-container\">           \r\n"
    + "    </div>\r\n"
    + "    <div class=\"tlv-data-container\">\r\n"
    + "    </div>          \r\n"
    + "</div>\r\n"
    + "\r\n"
    + "";

    return result;
}
function generateHTTPSpecContent(spec)
{
    var items = '';
    if(typeof spec != 'undefined')
    {
        if(typeof spec.specs != 'undefined')
        {
            for(var i = 0; i<spec.specs.length; i++)
            {
                items += generateHTTPSpecContentItem(spec.specs[i]);
            }
        }
    }
    var html = '<div class="desc-content">'+items+'</div>';
    return html;
}

function generateHTTPSpecContentItem(specItem)
{
    var label = htmlSpecialChars(specItem.label);
    var ssl = specItem.ssl?"Yes":"No";
    var host = specItem.host || '';
    host = host.split(':')[0];
    var port = specItem.port || '80';
    var path = specItem.path || '/';
    var method = specItem.method || 'GET';
    var request = createRequest(specItem);
    var response = createResponse(specItem);
    var simulator_configuration = htmlSpecialChars(specItem.simulator_configuration);
    var result = "<h2>"+label+"</h2>\r\n"
        + "<h3>Request</h3>\r\n"
        + "<table>\r\n"
        + "    <tbody>\r\n"
        + "        <tr>\r\n"
        + "            <td>SSL</td>\r\n"
        + "            <td>"+ssl+"</td>\r\n"
        + "        </tr>\r\n"
        + "        <tr>\r\n"
        + "            <td>Host</td>\r\n"
        + "            <td>"+host+"</td>\r\n"
        + "        </tr>\r\n"
        + "        <tr>\r\n"
        + "            <td>Port</td>\r\n"
        + "            <td>"+port+"</td>\r\n"
        + "        </tr>\r\n"
        + "        <tr>\r\n"
        + "            <td>Path</td>\r\n"
        + "            <td>"+path+"</td>\r\n"
        + "        </tr>\r\n"
        + "        <tr>\r\n"
        + "            <td>Method</td>\r\n"
        + "            <td>"+method+"</td>\r\n"
        + "        </tr>\r\n"
        + "    </tbody>\r\n"
        + "</table>\r\n"
        + "<pre>"+request+"</pre>\r\n"
        + "\r\n"
        + "<h3>Response</h3>\r\n"
        + "<pre>"+response+"</pre>\r\n"
        + "<h3>Simulator Configuration</h3>\r\n"
        + "<textarea spellcheck=\"false\" class=\"simulator-config\">"+simulator_configuration+"</textarea>\r\n"
        + "";
    return result;
}

/**
 * Save data to local storage
 * @param {string} key Key
 * @param {boolean} value Value
 */
 function setState(key, value)
 {
     var keyStorage = 'diag_'+key;
     if(value)
     {
         window.localStorage.setItem(keyStorage, '1');
     }
     else
     {
         window.localStorage.setItem(keyStorage, '0');
     }
 }
 
 /**
  * Save data to local storage
  * @param {string} key Key
  * @param {boolean} value Value
  */
 function setValue(key, value)
 {
     var keyStorage = 'diag_'+key;
     window.localStorage.setItem(keyStorage, value);
 }
  
 /**
  * Get data from local storage
  * @param {string} key Key
  * @param {boolean} val Value
  */
 function getState(key, val)
 {
     var saved = false;
     var keyStorage = 'diag_'+key;
     if(window.localStorage.getItem(keyStorage) != null)
     {
         var value = window.localStorage.getItem(keyStorage);
         if(value == '1')
         {
             saved = true;
         }
     }
     else
     {
         saved = val;
         document.querySelector('#'+key).checked = val;
     }
     document.querySelector('#'+key).checked = saved;
     return saved;
 }
 
 /**
  * Get data from local storage
  * @param {string} key Key
  * @param {boolean} val Value
  */
 function getValue(key, val)
 {
     var saved = '';
     var keyStorage = 'diag_'+key;
     if(window.localStorage.getItem(keyStorage) != null)
     {
         saved = window.localStorage.getItem(keyStorage);
     }
     else
     {
         saved = val;
     }
     document.querySelector('#'+key).value = saved;
     return saved;
 }

window.onload = function()
{
    showdatabase = getState('showdatabase', showdatabase);
    document.querySelector('#showdatabase').addEventListener('change', function(e){
        showdatabase = e.target.checked;
        setState('showdatabase', showdatabase);
        document.querySelector('#svg1').innerHTML = drawSVG();
    });
    showredis = getState('showredis', showredis);
    document.querySelector('#showredis').addEventListener('change', function(e){
        showredis = e.target.checked;
        setState('showredis', showredis);
        document.querySelector('#svg1').innerHTML = drawSVG();
    });
    showservicerelation = getState('showservicerelation', showservicerelation);
    document.querySelector('#showservicerelation').addEventListener('change', function(e){
        showservicerelation = e.target.checked;
        setState('showservicerelation', showservicerelation);
        document.querySelector('#svg1').innerHTML = drawSVG();
    });
    jsonprettify = getState('jsonprettify', jsonprettify);
    document.querySelector('#jsonprettify').addEventListener('change', function(e){
        jsonprettify = e.target.checked;
        setState('jsonprettify', jsonprettify);
    });
    xmlprettify = getState('xmlprettify', xmlprettify);
    document.querySelector('#xmlprettify').addEventListener('change', function(e){
        jsonprettify = e.target.checked;
        setState('xmlprettify', xmlprettify);
    });

    autoclosedesc = getState('autoclosedesc', autoclosedesc);
    document.querySelector('#autoclosedesc').addEventListener('change', function(e){
        autoclosedesc = e.target.checked;
        setState('autoclosedesc', autoclosedesc);
    });

    

    objectWidth = getValue('object_width', objectWidth);
    var value1 = objectWidth;
    document.querySelector('#object_width').value = value1;
    document.querySelector('#object_width').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value1+')';
    document.querySelector('#object_width').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        objectWidth = value;
        setValue('object_width', objectWidth);
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
        document.querySelector('#svg1').innerHTML = drawSVG();
    });
    objectHeight = getValue('object_height', objectHeight);
    var value2 = objectHeight;
    document.querySelector('#object_height').value = value2;
    document.querySelector('#object_height').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value2+')';
    document.querySelector('#object_height').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        objectHeight = value;
        setValue('object_height', objectHeight);
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
        document.querySelector('#svg1').innerHTML = drawSVG();
    });
    horizontalSpace = getValue('margin_width', horizontalSpace);
    var value3 = horizontalSpace;
    document.querySelector('#margin_width').value = value3;
    document.querySelector('#margin_width').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value3+')';
    document.querySelector('#margin_width').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        horizontalSpace = value;
        setValue('margin_width', horizontalSpace);
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
        document.querySelector('#svg1').innerHTML = drawSVG();
    });
    verticalSpace = getValue('margin_height', verticalSpace);
    var value4 = verticalSpace;
    document.querySelector('#margin_height').value = value4;
    document.querySelector('#margin_height').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value4+')';
    document.querySelector('#margin_height').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        verticalSpace = value;
        setValue('margin_height', verticalSpace);
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
        document.querySelector('#svg1').innerHTML = drawSVG();
    });


    
    


    document.querySelector('#svg1').addEventListener('click', function(e){
        clearTimeout(timeout);
        e.preventDefault();
        var id = e.target.parentNode.id || '';
        if(id == 'svg')
        {
            closeDesc();
        }
    });
    document.querySelector('#desc').addEventListener('mouseover', function(e){
        clearTimeout(timeout);
    });
    document.querySelector('#desc').addEventListener('mouseout', function(e){
        clearTimeout(timeout);
        if(autoclosedesc)
        {
            timeout = setTimeout(function(){
                closeDesc();
            }, 2000);
        }
    });

    document.querySelector('#svg1').innerHTML = drawSVG();

}
var timeout = setTimeout('', 100);
