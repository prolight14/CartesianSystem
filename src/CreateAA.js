/**
 * @function `createAA` Creates a key value pair system or associative array with methods
 * 
 * @param {Object} object The constructor/object to pass in 
 * @param {object} keypairs The keypairs/associative array to pass in (optional)
 * @param {string} arrayName What this array will be called (optional)
 * 
 * @returns {object} The keypair/associative array
 */
function CreateAA(object, keypairs, arrayName)
{
    if(typeof keypairs !== "object")
    {
        keypairs = Object.create(null);
    }

    if(typeof arrayName === "undefined")
    {
        arrayName = object.name.charAt(0).toLowerCase() + object.name.slice(1);
    }

    /**
     * All the methods and properties that are **NOT** part of the data that will be stored in `keypairs`
     */
    var system = {
        cache: {
            lowest: undefined, // Lowest empty index
            highest: -1, // highest index
        },
        references: {},
        length: 0,
        _name: arrayName,
        // Any thing added to this `add` method must also be added to the `add` method in the `if` statement
        add: function()
        {
            var id = this.cache.highest + 1;

            if(this.cache.lowest !== undefined && !this.unique)
            {
                id = this.cache.lowest;
                this.cache.lowest = undefined;
            }
            if(id > this.cache.highest)
            {
                this.cache.highest = id;
            }
            this.cache.tempId = id;
            this.length++;

            var item = new (Function.prototype.bind.apply(object, [null].concat(Array.prototype.slice.call(arguments))));

            this[id] = item;
            this[id]._name = this.cache.tempName === undefined ? this._name : this.cache.tempName;
            this[id]._arrayName = this._name;
            this[id]._id = id;
            return item;
        },
        remove: function(id)
        {
            if(this[id] === undefined)
            {
                return false;
            }

            if(id === this.cache.highest)
            {
                this.cache.highest--;
            }
            if(this.cache.lowest === undefined || id < this.cache.lowest)
            {
                this.cache.lowest = id;
            }

            this.length--;
            return delete this[id];
        },
        addObject: function(name)
        {
            if(this.references[name] !== undefined)
            {
                return;
            }
            
            var args = Array.prototype.slice.call(arguments);
            this.cache.tempName = args.shift();
            var item = this.add.apply(this, args);
            this.references[name] = this.cache.tempId;
            delete this.cache.tempId;
            return item;
        },
        getObject: function(name)
        {
            return this[this.references[name]] || delete this.references[name];
        },
        removeObject: function(name)
        {   
            var toRemove = this.references[name];
            var success = delete this.references[name];

            return this.remove(toRemove) && success;
        },
        forEach: function(callback)
        {
            for(var i in this)
            {
                callback(this[i], i, this);
            }

            return this;
        },
        define: function(key, prop)
        {
            Object.defineProperty(this, key,  
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: prop
            });
        }
    };

    // If it's an array
    if(object.apply === undefined)
    {
        system.add = function()
        {
            var id = this.cache.highest + 1;
            if(this.cache.lowest !== undefined && !this.unique)
            {
                id = this.cache.lowest;
                this.cache.lowest = undefined;
            }
            if(id > this.cache.highest)
            {
                this.cache.highest = id;
            }
            this.cache.tempId = id;
            this.length++;

            this[id] = arguments[0];

            Object.defineProperty(this[id], "_name", 
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: this.cache.tempName === undefined ? this._name : this.cache.tempName
            });
            Object.defineProperty(this[id], "_arrayName",
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: this._name
            });
            Object.defineProperty(this[id], "_id", 
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: id
            });
            return this[id];
        };
    }

    // Add methods and properties from system to keypairs/associative array that will be returned
    for(var i in system)
    {
        Object.defineProperty(keypairs, i,  
        {
            enumerable: false,
            writable: true,
            configurable: true,
            value: system[i]
        });
    }

    return keypairs;
}

module.exports = CreateAA;