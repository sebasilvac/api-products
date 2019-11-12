export default class SimulatedPagination {

    constructor(page, limit, listSku) {
        this.page = Number(page);
        this.limit = Number(limit);
        this.listSku = listSku;
        this.num = listSku.length;
    }

    /**
     * Simulamos una paginación a partir de un array
     */
    simulatedPagination() {

        // obtenemos el total de páginas según el número de items por página
        let totalPages = Math.floor( this.num / ( this.limit || 10 ) );
        let rest = this.num % ( this.limit || 10);
        if (rest > 0) {
            totalPages++;
        }

        // verificamos que el total de páginas sea un número válido
        if (this.page > totalPages) {
            this.page = totalPages;
        }

        // obtenemos los SKU según paginación
        let since = this.page * this.limit - this.limit;
        let to = since + this.limit;

        const paginatedList = this.listSku.slice(since, to);

        return {
            totalPages: totalPages,
            limit: this.limit,
            totalItems: this.num,
            page: this.page,
            products: paginatedList
        };
    }
}
