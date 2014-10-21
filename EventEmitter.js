function EventEmitter()
{
  this.callbacks = {};
  this.redo = {};
  
  if(!(this instanceof EventEmitter))
    return new EventEmitter();
}

EventEmitter.prototype = {
  on : function(event, fn)
  {
    if(!this.callbacks.hasOwnProperty(event))
    this.callbacks[event] = [];

    this.callbacks[event].push(fn);

    return this;
  },
  once : function(event, fn)
  {
    this.redo[event] = [];
    this.redo[event][0] = fn;

    return this;
  },
  times : function(event, nb, fn)
  {
    this.once(event, fn);
    for(var i = 1; i < nb; i++)
    {
      this.redo[event][i] = fn;
    }

    return this;
  },
  offAll : function()
  {
    this.callbacks = {};
    this.redo = {};

    return this;
  },
  offEvent : function(event)
  {
    if(this.callbacks.hasOwnProperty(event))
      delete this.callbacks[event];
    if(this.redo.hasOwnProperty(event))
      delete this.redo[event];

    return this;
  },
  off : function(event, fn)
  {
    if(this.callbacks.hasOwnProperty(event))
    {
      var index = this.callbacks[event].indexOf(fn);
      if(index >= 0)
        delete this.callbacks[event][index];
    }
    if(this.redo.hasOwnProperty(event))
    {
      var index = this.redo[event].indexOf(fn);
      if(index >= 0)
        delete this.redo[event][index];
    }

    return this;
  },
  emit : function(event)
  {
    var args = Array.prototype.slice.call(arguments, 1);

    if(this.callbacks.hasOwnProperty(event))
    {
      this.callbacks[event].forEach(function(laFonction)
      {
          laFonction.apply(null, args);
      });
    }
    
    if(this.redo.hasOwnProperty(event))
    {
      var index = this.redo[event].indexOf(fn);
      if(index >= 0)
      {
        this.redo[event][index].apply(null, args);
        this.off(event, fn);
      }
    }
    
    return this;
  }
};

var fn = console.log.bind(console);

/*EventEmitter()
  .times('event1', 3, fn)
  .on('event2', function(x) { fn(x + 2); })
  .once('event1', fn)
  .emit('event1', 'coucou', 'test32', 'lol')
  .emit('event1', 'coucou', 'test32', 'lol')
  .emit('event1', 'coucou', 'test32', 'lol')
  .emit('event1', 'coucou', 'test32', 'lol')
  .emit('event1', 'coucou', 'test32', 'lol')
  .emit('event2', 5);*/