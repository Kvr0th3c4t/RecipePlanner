import { Button } from './Button';

export const Pagination = ({
    currentPage,
    totalPages,
    onNext,
    onPrev
}) => {
    return (
        <div className="flex justify-center items-center gap-4 mb-5">
            <Button
                variant="ghost"
                onClick={onPrev}
                disabled={currentPage === 1}
                style={{ display: currentPage === 1 ? 'none' : 'inline-flex' }}
            >
                Anterior
            </Button>

            <span className="text-gray-700">
                Página {currentPage} de {totalPages}
            </span>

            <Button
                variant="ghost"
                onClick={onNext}
                disabled={currentPage === totalPages}
                style={{ display: currentPage === totalPages ? 'none' : 'inline-flex' }}
            >
                Siguiente
            </Button>
        </div>
    );
};