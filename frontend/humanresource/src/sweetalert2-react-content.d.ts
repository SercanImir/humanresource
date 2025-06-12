declare module 'sweetalert2-react-content' {
    import Swal from 'sweetalert2';
    export default function withReactContent(swal: typeof Swal): typeof Swal;
}