var template = '<div><span>当前count的值：{{count}}</span><button @click="onCountAddClick">count++</button></div>';

var btnCountAdd = {
    template: template,
    data: function (){
        return {
            count: 0
        }
    },
    methods: {
        onCountAddClick: function(){
            this.count += 1;
        }
    }
}

export {btnCountAdd};