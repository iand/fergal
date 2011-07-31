
var Fergal = { };

Fergal.SimpleGraph = function() {
  this._index = {};
  this._version = 0;
  this._ns_rev = {};
  this._synonyms = {};
  for (var prefix in this._ns) {
    this._ns_rev[this._ns[prefix]] = prefix;
  }

}

Fergal.SimpleGraph.prototype = {
  _ns : {
    'rdf' : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'

    ,'ad' : 'http://schemas.talis.com/2005/address/schema#'
    ,'air' : 'http://www.daml.org/2001/10/html/airport-ont#'
    ,'bf' : 'http://schemas.talis.com/2006/bigfoot/configuration#'
    ,'bibo' : 'http://purl.org/ontology/bibo/'
    ,'bio' : 'http://purl.org/vocab/bio/0.1/'
    ,'cc' : 'http://creativecommons.org/ns#'
    ,'contact' : 'http://www.w3.org/2000/10/swap/pim/contact#'
    ,'cs' : 'http://purl.org/vocab/changeset/schema#'
    ,'dbpedia':'http://dbpedia.org/resource/'
    ,'dbo':'http://dbpedia.org/ontology/'
    ,'dbp':'http://dbpedia.org/property/'
    ,'dc' : 'http://purl.org/dc/elements/1.1/'
    ,'dct' : 'http://purl.org/dc/terms/'
    ,'dctype' : 'http://purl.org/dc/dcmitype/'
    ,'dimb':'http://musicbrainz.dataincubator.org/schema/'
    ,'dir' : 'http://schemas.talis.com/2005/dir/schema#'
    ,'event' : 'http://purl.org/NET/c4dm/event.owl#'
    ,'fact' : 'http://www4.wiwiss.fu-berlin.de/factbook/ns#'
    ,'fb' : 'http://rdf.freebase.com/ns/'
    ,'foaf' : 'http://xmlns.com/foaf/0.1/'
    ,'frbr' : 'http://purl.org/vocab/frbr/core#'
    ,'frm' : 'http://schemas.talis.com/2006/frame/schema#'
    ,'geo' : 'http://www.w3.org/2003/01/geo/wgs84_pos#'
    ,'gn' : 'http://www.geonames.org/ontology#'
    ,'gr' : 'http://purl.org/goodrelations/v1#'
    ,'label' : 'http://purl.org/net/vocab/2004/03/label#'
    ,'lib' : 'http://schemas.talis.com/2005/library/schema#'
    ,'mo' : 'http://purl.org/ontology/mo/'
    ,'nyt' : 'http://data.nytimes.com/elements/'
    ,'ogp' : 'http://opengraphprotocol.org/schema/'
    ,'os':'http://data.ordnancesurvey.co.uk/ontology/admingeo/'
    ,'ov' : 'http://open.vocab.org/terms/'
    ,'owl' : 'http://www.w3.org/2002/07/owl#'
    ,'po' : 'http://purl.org/ontology/po/'
    ,'postcode' : 'http://data.ordnancesurvey.co.uk/ontology/postcode/'
    ,'rdfs' : 'http://www.w3.org/2000/01/rdf-schema#'
    ,'rel' : 'http://purl.org/vocab/relationship/'
    ,'rev' : 'http://purl.org/stuff/rev#'
    ,'rss' : 'http://purl.org/rss/1.0/'
    ,'sioc' : 'http://rdfs.org/sioc/ns#'
    ,'skos' : 'http://www.w3.org/2004/02/skos/core#'
    ,'spatial' : 'http://data.ordnancesurvey.co.uk/ontology/spatialrelations/'
    ,'status' : 'http://www.w3.org/2003/06/sw-vocab-status/ns#'
    ,'sv' : 'http://schemas.talis.com/2005/service/schema#'
    ,'swivt' : 'http://semantic-mediawiki.org/swivt/1.0#'
    ,'ub' : 'http://uberblic.org/ontology/'
    ,'user' : 'http://schemas.talis.com/2005/user/schema#'
    ,'void' : 'http://rdfs.org/ns/void#'
    ,'vcard':'http://www.w3.org/2006/vcard/ns#'
    ,'wn' : 'http://xmlns.com/wordnet/1.6/'
    ,'xsd' : 'http://www.w3.org/2001/XMLSchema#'

  }
  
  

  
  ,add_prefix : function(prefix, uri) {
    this._ns[prefix] = uri;
    this._ns_rev[uri] = prefix;
  }

  ,add_synonym : function(uri1, uri2) {
    if (! this._synonyms.hasOwnProperty(uri1)) {
      this._synonyms[uri1] = new Array();
    }
    if (! this._synonyms.hasOwnProperty(uri2)) {
      this._synonyms[uri2] = new Array();
    }
    this._synonyms[uri1].push(uri2);
    this._synonyms[uri2].push(uri1);
  }


  ,version : function() {
    return this._version;
  }
  
  ,add_resource_triple : function(s, p, o) {
    return this.add(s,p,o);
  }

  ,add_literal_triple : function(s, p, o, l, dt) {
    return this.add(s,p,[o,l,dt]);
  }

  ,add : function(s,p,val) {
    if (typeof(val) == 'string') {
      if (! this.has_resource_triple(s, p, val) ) {
        var o_type = val.indexOf('_:') == 0 ? 'bnode' : 'uri';
        var o_info = { "type" : o_type , "value" : this.uri(val) };
        this._add_triple(s, p, o_info);
        return true;
      }
    }
    else if (val instanceof Array) {
      var o = val[0];
      var l = val.length > 1 ? val[1] : undefined;
      var dt = val.length > 2 ? val[2] : undefined;
      if (! this.has_literal_triple(s, p, o, l, dt) ) {
        var o_info = { "type" : 'literal' , "value" : o, 'lang' : l, 'datatype' : this.uri(dt) };
        this._add_triple(s, p, o_info);
        return true;
      }
    }

    return false;
  }


  ,_add_triple : function(s, p, o_info) {
    s = this.uri(s);
    p = this.uri(p);
    if (! this._index.hasOwnProperty(s)) {
      this._index[s] = {};
      this._index[s][p] = new Array();
    }
    else if (! this._index[s].hasOwnProperty(p)) {
      this._index[s][p] = new Array();
    }

    this._index[s][p].push(o_info);
    this._version++;
  }

  ,from_json : function(data) {
    if ( arguments.length < 2 ) base = '';
    if (typeof data === "string") {
      this._index = JSON.parse(data);
    }
    else  {
      this._index = data;
    }
    this._version++;
  }

  ,remove_resource_triple : function(s, p, o) {
    s = this.uri(s);
    p = this.uri(p);
    o = this.uri(o);
    if (! this._index.hasOwnProperty(s) || ! this._index[s].hasOwnProperty(p)) return;
    for (var i = 0; i < this._index[s][p].length; i++) {
      if ( this._index[s][p][i]['type'] == 'uri' && this._index[s][p][i]['value'] == o ) {
        if ( this._index[s][p].length <=1 ) {
          this.remove_property_values(s, p);
        }
        else {
          this._index[s][p].splice(i, 1);
        }
        this._version++;
        return;
      }
    }
  }

  ,remove_triples_about : function(s) {
    s = this.uri(s);
    if (! this._index.hasOwnProperty(s) ) return;
    delete this._index[s];
    this._version++;
  }

  ,remove_property_values : function(s, p) {
    s = this.uri(s);
    p = this.uri(p);
    if (! this._index.hasOwnProperty(s) || ! this._index[s].hasOwnProperty(p)) return false;
    delete this._index[s][p];

    var prop_count = 0;
    for (var prop in this._index[s]) prop_count++;
    if ( prop_count == 0) {
      delete this._index[s];
      this._version++;
    }

  }

  ,remove_all_triples : function() {
    this._index = {};
    this._version++;
  }


  ,get_index : function() {
    return this._index;
  }




  ,dump_to_console : function() {
    for (var s in this._index) {
      var s_str = s;
      if (s.indexOf('_:') != 0) {
        s_str = '<' + s_str + '>';
      }
      if (this._index.hasOwnProperty(s)) {
        for (var p in this._index[s]) {
          if (this._index[s].hasOwnProperty(p)) {
            for (var i = 0; i < this._index[s][p].length; i++) {
              if (this._index[s][p][i]['type'] == 'uri') {
                console.log(s_str + ' <' + p + '> <' + this._index[s][p][i]['value'] + '>');
              }
              else if (this._index[s][p][i]['type'] == 'bnode') {
                console.log(s_str + ' <' + p + '> ' + this._index[s][p][i]['value']);
              }
              else if (this._index[s][p][i]['type'] == 'literal') {
                console.log(s_str + ' <' + p + '> "' + this._index[s][p][i]['value'] + '"');
              }
              else {
                console.log("Unknown value type for " + s_str + ' <' + p + '> index ' + i);
              }
            }
          }
        }
      }
    }
  }

  ,count : function() {
    var ret = 0;
    for (var s in this._index) {
      if (this._index.hasOwnProperty(s)) {
        for (var p in this._index[s]) {
          if (this._index[s].hasOwnProperty(p)) {
            ret += this._index[s][p].length;
          }
        }
      }
    }
    return ret;
  }

  ,get_first_resource : function(s, pl, def) {
    s = this.uri(s);
    if ( arguments.length < 3 ) def = '';
    if (typeof(pl) == 'string') {
      pl = [pl];
    }
    pl = this.synonyms(pl);
    for (var i = 0; i < pl.length; i++) {
      var p = this.uri(pl[i]);

      if (! this._index.hasOwnProperty(s)) return def;
      if (this._index[s].hasOwnProperty(p)) {
        for (var i = 0; i < this._index[s][p].length; i++) {
          if ( this._index[s][p][i]['type'] != 'literal') {
            return this._index[s][p][i]['value'];
          }
        }
      }
    }
    return def;
  }

  ,get_first_literal : function(s, pl, def, lang) {
    if (pl == undefined) return;
    s = this.uri(s);
    if ( arguments.length < 3 ) def = '';
    if ( arguments.length < 4 ) lang = 'en';

    if (! this._index.hasOwnProperty(s) ) return def;

    if (typeof(pl) == 'string') pl = [pl];
    pl = this.synonyms(pl);

   
    for (var pi = 0; pi < pl.length; pi++) {
      var p = this.uri(pl[pi]);
      if (this._index[s].hasOwnProperty(p)) {
        var best_literal = undefined;
        for (var i = 0; i < this._index[s][p].length; i++) {
          if ( this._index[s][p][i]['type'] == 'literal') {
            if (this._index[s][p][i]['lang'] == lang) {
              return this._index[s][p][i]['value'];
            }
            else {
              best_literal = this._index[s][p][i]['value'];
            }
          }
        }
      
        if (best_literal != undefined) {
          return best_literal;
        }
      }
    }
    return def;
  }

  ,get_literal_group : function(s, pl) {
    var values = new Array();
    for (var pi = 0; pi < pl.length; pi++) {
      var val = this.get_first_literal(s, pl[pi], '~~missing~~');
      if (val == '~~missing~~') return new Array();
      values.push(val);
    }
    return values;
  }


  ,is_empty : function() {
    var subj_count = 0;
    for (var subj in this._index) return false;
    return true;
  }

  ,is_type : function(s, o) {
    if (typeof(o) == 'string') {
      o = [o];
    }
    for (var i = 0; i < o.length; i++) {
      if (this.has_resource_triple(s,'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',this.uri(o[i]))) return true;
    }
    return false;
  }

  ,has_resource_triple : function(s, p, o) {
    s = this.uri(s);
    p = this.uri(p);
    o = this.uri(o);
    if (! this._index.hasOwnProperty(s) || ! this._index[s].hasOwnProperty(p)) return false;
    var o_type = o.indexOf('_:') == 0 ? 'bnode' : 'uri';
    for (var i = 0; i < this._index[s][p].length; i++) {
      if ( this._index[s][p][i]['type'] == o_type && this._index[s][p][i]['value'] == o ) return true;
    }
    return false;
  }

  ,has_literal_triple : function(s, p, o, l, dt) {
    s = this.uri(s);
    p = this.uri(p);
    if (dt) dt = this.uri(dt);
    if (! this._index.hasOwnProperty(s) || ! this._index[s].hasOwnProperty(p)) return false;
    for (var i = 0; i < this._index[s][p].length; i++) {
      if ( this._index[s][p][i]['type'] == 'literal' && this._index[s][p][i]['value'] == o ) {
        if ( this._index[s][p][i].hasOwnProperty('lang') ) {
          if ( arguments.length > 3 && this._index[s][p][i]['lang'] == l ) {
            return true;
          }
        }
        else if ( this._index[s][p][i].hasOwnProperty('datatype') ) {
          if ( arguments.length > 4 && this._index[s][p][i]['datatype'] == dt ) {
            return true;
          }
        }
        else {
          return true;
        }
      }
    }
    return false;
  }

  ,has_triple_about : function(s) {
    s = this.uri(s);
    return this._index.hasOwnProperty(s);
  }

  ,has_property : function(s,pl) {
    s = this.uri(s);
    if (this._index.hasOwnProperty(s)) {
      if (typeof(pl) == 'string') pl = [pl];
      pl = this.synonyms(pl);
      for (var i = 0; i < pl.length; i++) {
        if (this._index[s].hasOwnProperty(this.uri(pl[i]))) return true;
      }
    }
    return false;
  }

  ,subject_exists : function(s) {
    s = this.uri(s);
    return this._index.hasOwnProperty(s);
  }

  ,properties : function(s) {
    s = this.uri(s);
    var props = [];

    if (this._index.hasOwnProperty(s)) {
      for (var prop in this._index[s]) {
        if (this._index[s].hasOwnProperty(prop)) {
          props.push(prop);
        }
      }
    }
    return props;
  }

  ,subjects : function(p,o) {
    p = this.uri(p);
    var subs = [];

    for (var s in this._index) {
      if (this._index.hasOwnProperty(s)) {
        if (arguments.length < 2) {
          subs.push(s);
        }
        else {
          if (this._index[s].hasOwnProperty(p)) {
            if (arguments.length < 3) {
              subs.push(s);
            }
            else {
              var o_type = o['type'];
              var o_val = o['value'];
              for (var i = 0; i < this._index[s][p].length; i++) {
                if ( this._index[s][p][i]['type'] == o_type && this._index[s][p][i]['value'] == o_val ) {
                  if ( this._index[s][p][i]['type'] == 'literal' && this._index[s][p][i]['value'] == o ) {
                    if ( this._index[s][p][i].hasOwnProperty('lang') ) {
                      if ( arguments.length > 3 && this._index[s][p][i]['lang'] == o['lang'] ) {
                        subs.push(s);
                      }
                    }
                    else if ( this._index[s][p][i].hasOwnProperty('datatype') ) {
                      if ( arguments.length > 4 && this._index[s][p][i]['datatype'] == this.uri(o['dt']) ) {
                        subs.push(s);
                      }
                    }
                    else {
                      subs.push(s);
                    }
                  }
                }
                else {
                  subs.push(s);
                }
              }
            
            }
          }
        }
      }
    }

    return subs;
  }

  /* Get the values of triples with subject=s and a property in pl. 
   * Properties prefixed with a ! are in the reverse direction, so s is
   * interpreted as the object and the value returned is the subject
   * of the triple */
  ,values : function(s,pl) {
    s = this.uri(s);
    var values = [];
    if (typeof(pl) == 'string') pl = [pl];
    pl = this.synonyms(pl);
    for (var pi = 0; pi < pl.length; pi++) {
      if (pl[pi].slice(0,1) == '!') {
        values = values.concat(this.backlinks(pl[pi].slice(1), s));
      }
      else {
        var p = this.uri(pl[pi]);
        if (this.subject_exists(s)) {
          if (this._index[s].hasOwnProperty(p)) {
            values = values.concat(this._index[s][p]);
          }
        }
      }
    }
    return values;
  }

  ,backlinks: function(pl,o) {
    o = this.uri(o);
    if (typeof(pl) == 'string') pl = [pl];
    pl = this.synonyms(pl);
    for (var pi = 0; pi < pl.length; pi++) {
      p = this.uri(pl[pi]);
      var resources = [];
      var subjects = this.subjects();
      for (var i = 0; i < subjects.length; i++) {
        if (this.has_resource_triple(subjects[i], p, o)) {
          var s_info = { "type" : 'uri' , "value" : subjects[i] };
          resources.push(s_info);
        }
      }
    }
    return resources;
  }

  


  ,get_label : function(resource_uri, lang) {
    resource_uri = this.uri(resource_uri);
    if ( arguments.length <2 ) lang = 'en';
    return this.get_first_literal(resource_uri,[ 'skos:prefLabel'
                                                   ,'dct:title'
                                                   ,'dc:title'
                                                   ,'rdfs:label'
                                                   ,'rss:title'
                                                   ,'foaf:name'
                                                   ,'sioc:name'
                                                   ,'rdfs:value'
                                                   ,'vcard:label'
                                                   ,'gn:name'
                                                   ,'ogp:title'
                                                   ,'http://rdf.freebase.com/ns/type.object.name'
                                                   ,'http://education.data.gov.uk/ontology/school#establishmentName'
                                                ], resource_uri, lang);
  }


  ,get_description : function(resource_uri) {
    resource_uri = this.uri(resource_uri);
    if ( arguments.length <2 ) lang = 'en';
    return this.get_first_literal(resource_uri,[ 'dct:description'
                                                  ,'dc:description'
                                                  ,'rss:description'
                                                  ,'bio:olb'
                                                  ,'po:short_synopsis'
                                                  ,'dct:abstract'
                                                  ,'dbo:abstract'
                                                  ,'rdfs:comment'
                                                  ], '', lang);
  }

  ,qname : function(uri) {
    var store_re = /^http:\/\/api\.talis\.com\/stores\/([^\/]+)\/items\/([^\#]+)\#self$/;

    var uri_re = /^(.*[\/\#])([a-z0-9\-\_\.]+)$/i;
    if (m = store_re.exec(uri)) {
      return m[1] + ':' + m[2];
    }
    else if (m = uri_re.exec(uri)) {
      ns = m[1];
      localname = m[2];
      prefix = this.get_prefix('' + ns);
      if (prefix) {
        return prefix + ':' + localname;
      }
    }
    return undefined;
  }

  ,uri : function(q) {
    var qname_re = /^([a-z0-9\-\_]+):([a-z0-9\-\_\.]+)$/i;
    if (m = qname_re.exec(q)) {
      if (this._ns.hasOwnProperty(m[1])) {
        return this._ns[m[1]] + m[2];
      }
    }
    
    return q;
  }

  // Expands the array of URIs, adding in registered synonyms for the URIs
  ,synonyms : function(ul) {
    var res = [];
    for (var ui = 0; ui < ul.length; ui++) {
      var u = this.uri(ul[ui]);
      res.push(u)
      if (this._synonyms.hasOwnProperty(u)) {
        res = res.concat(this._synonyms[u]);
      }
    }
    return res;
  }


  ,get_prefix : function(ns) {
    if (this._ns_rev.hasOwnProperty(ns)) {
      return this._ns_rev[ns];
    }
    else {

      if (ns.slice(ns.length-1) == '#') {
        ns = ns.slice(0, ns.length - 1);
      }
      slash_pos = ns.lastIndexOf('/');
      while (slash_pos != -1) {
        candidate = ns.slice(slash_pos + 1);
        if (candidate.search(/^[a-zA-Z][a-zA-Z0-9\-]*$/) != -1 && candidate.length > 1 && !this._ns.hasOwnProperty(candidate) && candidate != 'schema' && candidate != 'ontology' && candidate != 'vocab' && candidate != 'terms' && candidate != 'ns' && candidate != 'core') {
          return candidate.toLowerCase();
        }
        ns = ns.slice(0, slash_pos);
        slash_pos = ns.lastIndexOf('/');

      }
    }
    return undefined;
  }


  ,select : function(fieldlist) {
    var q = new Fergal.Query(this);
    return q.select(fieldlist);
  }

  ,subject : function(value) {
    var q = new Fergal.Query(this);
    return q.subject(value);
  }

  ,optional : function(fieldlist) {
    var q = new Fergal.Query(this);
    return q.optional(fieldlist);
  }

  ,distinct : function() {
    var q = new Fergal.Query(this);
    return q.distinct();
  }

  ,from : function(typelist) {
    var q = new Fergal.Query(this);
    return q.from(typelist);
  }

  ,limit : function(val,offset) {
    var q = new Fergal.Query(this);
    return q.limit(val,offset);
  }

  ,order_by : function(field,direction) {
    var q = new Fergal.Query(this);
    return q.order_by(field,direction);
  }
}

Fergal.Query = function(g) {
  this._g = g;
  this._map = {};
  this._rmap = {};
  this._is_distinct = false;
  this._limit = 0;
  this._offset = 0;
  this._joins = [];
  this._selections = {};
  this._fields = [];
  this._filters = [];
  this._subject = '';
}

Fergal.Query.prototype = {

   map : function(uri,name) {
    this._map[uri] = name;
    this._rmap[name] = uri;
    return this;
  }

  ,distinct : function() {
    this._is_distinct = true;
    return this;
  }
  
  ,limit : function(val,offset) {
    if (arguments.length < 2) offset = 0;
    this._limit = val;
    this._offset = offset;
    return this;
  }
  
  ,select : function(fieldlist) {
    fieldlist = fieldlist.replace(/^\s+|\s+$/g, '');
    var fields = fieldlist.split(',');
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i].replace(/^\s+|\s+$/g, '');
      if (field.indexOf('/') >0 ) {
        var parts = field.split('/');
        this._joins.push(parts);
        this._selections[parts[0] + '_' + parts[parts.length-1]] = 1;
      }
      else {
        this._fields.push({'name':field, 'required':true});
      }
    }
    return this;
  }

  ,optional : function(fieldlist) {
    fieldlist = fieldlist.replace(/^\s+|\s+$/g, '');
    var fields = fieldlist.split(',');
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i].replace(/^\s+|\s+$/g, '');
      this._fields.push({'name':field, 'required':false});
    }
    return this;
  }

  ,from : function(typelist) {
    typelist = typelist.replace(/^\s+|\s+$/g, '');
    var types = typelist.split(',');
    for (var i = 0; i < types.length; i++) {
      var type = types[i].replace(/^\s+|\s+$/g, '');
      this._filters.push({'field':'rdf:type', 'op':'uri', 'value':type});
    }
    return this;
  }
  
  ,order_by : function(field,direction) {
    if (arguments.length < 2) direction = 'ASC';
    this._orders.push({'field' : field, 'ordering' : direction});
    return this;
  }
  
  // for literal matches only
  ,where : function(field, value) {
    var op = '=';
    var m = /^(.+)\s*(>|<|\!\=|<=|>=)$/.exec(field);
    if (m) {
      op = m[2];
      field = m[1].replace(/^\s+|\s+$/g, '');
    }
    this._filters.push({'field':field, 'op':op, 'value':value});
    return this;
  }

  ,where_uri : function(field, uri) {
    this._filters.push({'field':field, 'op':'uri', 'value': uri});
    return this;
  }

  ,subject : function(value) {
    this._subject = value;
    return this;
  }
  
  ,get : function() {
    var rows = [];
    var index = this._g.get_index();
    if (this._subject) {
      rows = this._getsub(this._subject);
    }
    else {
      for (var s in index) {
        if (index.hasOwnProperty(s)) {
          rows = rows.concat(this._getsub(s));
        }
      }
    }
    if (this._limit > 0) {
      return rows.slice(this._offset, this._offset + this._limit);
    }
    return rows;
  }
  
  ,_getsub : function(s) {
    var index = this._g.get_index();
    var rows = [];

    // test filters
    for (var fili = 0; fili < this._filters.length; fili++) {
      //console.log("Checking filter for field " + field + " and value " + value);
      var filter = this._filters[fili];
      var p = this._g.uri(filter['field']);
      if (!index[s].hasOwnProperty(p)) return [];
      var passed_filter = false;
      for (var vi = 0; vi < index[s][p].length; vi++) {
        var value = index[s][p][vi]['value'];

        if (filter['op'] == '=') {
          if (index[s][p][vi]['type'] == 'literal' || value == filter['value']) {
            passed_filter = true;
            break;
          }
        }
        else if (filter['op'] == 'uri') {
          if (index[s][p][vi]['type'] == 'uri' || value == this._g.uri(filter['value'])) {
            passed_filter = true;
            break;
          }
        }
        else if (filter['op'] == '<') {
          if (index[s][p][vi]['type'] == 'literal' || value < filter['value']) {
            passed_filter = true;
            break;
          }
        }
        else if (filter['op'] == '>') {
          if (index[s][p][vi]['type'] == 'literal' || value > filter['value']) {
            passed_filter = true;
            break;
          }
        }
        else if (filter['op'] == '!=') {
          if (index[s][p][vi]['type'] == 'literal' || value != filter['value']) {
            passed_filter = true;
            break;
          }
        }
        else if (filter['op'] == '>=') {
          if (index[s][p][vi]['type'] == 'literal' || value >= filter['value']) {
            passed_filter = true;
            break;
          }
        }
        else if (filter['op'] == '<=') {
          if (index[s][p][vi]['type'] == 'literal' || value <= filter['value']) {
            passed_filter = true;
            break;
          }
        }
      }
      if (!passed_filter) return [];
    }


    // get field values
    for (var fi = 0; fi < this._fields.length; fi++) {
      var fieldinfo = this._fields[fi];
      var field = fieldinfo['name'];
      var required = fieldinfo['required'];
      var p = this._g.uri(field);
      
      if (!index[s].hasOwnProperty(p)) {
        if (required) {
          return [];
        }
        else {
          for (var ri = 0; ri < rows.length; ri++) {
            rows[ri][field] = '';
          }
        }
      }
      else {
        var newrows = [];
        for (var vi = 0; vi < index[s][p].length; vi++) {
          var value = index[s][p][vi]['value'];
          if (rows.length > 0) {
            for (var ri = 0; ri < rows.length; ri++) {
              //console.log("Extending row for field " + field + " and value " + value);
              var newrow = {};
              for (fn in rows[ri]) {
                if (rows[ri].hasOwnProperty(fn)) {
                  newrow[fn] = rows[ri][fn];
                }
              }
              newrow[field] = value;
              newrows.push(newrow);
            }
          }
          else {
            var newrow = {};
            //console.log("Creating a new row for field " + field + " and value " + value);
            newrow[field] = value;
            newrows.push(newrow);
          }
        }
        rows = newrows.slice(0);
      }
    }
    
    return rows;
      
  }

}

if (!this.JSON) {
    JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapeable.lastIndex = 0;
        return escapeable.test(string) ?
            '"' + string.replace(escapeable, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// If the object has a dontEnum length property, we'll treat it as an array.

            if (typeof value.length === 'number' &&
                    !value.propertyIsEnumerable('length')) {

// The object is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (var i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (var i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (var i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                var j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
})();



