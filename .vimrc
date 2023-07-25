if has("autocmd")
    " configure expanding of tabs for various file types
    au BufRead,BufNewFile *.py          set expandtab
    au BufRead,BufNewFile *.py          set list
    au BufRead,BufNewFile *.h           set noexpandtab
    au BufRead,BufNewFile *.c           set noexpandtab
    au BufRead,BufNewFile *.cpp         set noexpandtab
    au BufRead,BufNewFile *.h           set list
    au BufRead,BufNewFile *.c           set list
    au BufRead,BufNewFile *.cpp         set list
endif
"
" GNUmakefile Makefile *.mk
if has("autocmd")
"
    autocmd FileType make               set noexpandtab
    autocmd FileType make               set softtabstop=4
    autocmd FileType make               set list
"
    au BufRead,BufNewFile Makefile      set noexpandtab
    au BufRead,BufNewFile Makefile      set softtabstop=4
    au BufRead,BufNewFile Makefile      set list
"
    au BufRead,BufNewFile GNUmakefile   set noexpandtab
    au BufRead,BufNewFile GNUmakefile   set softtabstop=4
    au BufRead,BufNewFile GNUmakefile   set list
"
    au BufRead,BufNewFile *.sh*         set list
    au BufRead,BufNewFile *.vimrc*      set list
    au BufRead,BufNewFile *.vimrc*      set noexpandtab
"
    au BufRead,BufNewFile *ockerfile*   set noexpandtab list
    au BufRead,BufNewFile *.yml         set noexpandtab softtabstop=2 list
    au BufRead,BufNewFile *.yaml        set noexpandtab softtabstop=2 list
"
    au BufRead,BufNewFile *.md          set noexpandtab
    au BufRead,BufNewFile *.md          set softtabstop=4
    " au BufRead,BufNewFile *.md        set expandtab!
    au BufRead,BufNewFile *.md          set list
endif
"
" make backspaces more powerfull
set backspace=indent,eol,start
"
set ruler               " show line and column number
syntax on               " syntax highlighting
set showcmd             " show (partial) command in status line
set number
set scrolloff=3

" Use hybrid line numbers
if exists("&relativenumber")
    set number relativenumber
    au BufReadPost * set relativenumber
endif


" SOLARIZED HEX
" --------- -------
" base03    #002b36
" base02    #073642
" base01    #586e75
" base00    #657b83
" base0     #839496
" base1     #93a1a1
" base2     #eee8d5
" base3     #fdf6e3
" yellow    #b58900
" orange    #cb4b16
" red       #dc322f
" magenta   #d33682
" violet    #6c71c4
" blue      #268bd2
" cyan      #2aa198
" green     #859900
"
if has("gui_running")
set go+=!
set background=dark
let g:solarized_termcolors=256
    set termguicolors
    colorscheme solarized
else
set background=dark
let g:solarized_termcolors=256
    set termguicolors
    colorscheme solarized
endif
let g:solarized_termtrans=1
"
if has('title') && (has('gui_running') || &title)
"  set titlestring=
    set titlestring+=%f
    set titlestring+=%h%m%r%w
    set titlestring+=\ -\ %{v:progname}
    set titlestring+=\ -\ %{substitute(getcwd(),\ $HOME,\ '~',\ '')}
endif
"
"
set colorcolumn=40,50,79,81,129,131,159,161,209,211
highlight TabLineSel             cterm=underline,reverse cterm=underline,reverse ctermfg=0 ctermbg=0 gui=bold
highlight TabLineFill            cterm=underline cterm=underline ctermfg=12 ctermbg=0 gui=reverse
highlight CursorLine                      ctermfg=0 ctermbg=blue guibg=#073642
highlight CursorColumn                    ctermfg=0 ctermbg=red  guibg=blue
highlight LightlineRight_tabline_0        ctermfg=0 ctermbg=0 guifg=#a8a8a8 guibg=#666666
highlight LightlineRight_tabline_0_1      ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444
highlight LightlineRight_tabline_0_tabsel ctermfg=0 ctermbg=0 guifg=#666666 guibg=#242424
highlight LightlineRight_tabline_tabsel   ctermfg=0 ctermbg=0 guifg=#d0d0d0 guibg=#242424
highlight LightlineRight_tabline_tabsel_0 ctermfg=0 ctermbg=0 guifg=#242424 guibg=#666666
highlight LightlineRight_inactive_1       ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444
"
highlight LightlinLeft_tabline_0          ctermfg=0 ctermbg=0 guifg=#a8a8a8 guibg=#666666
highlight LightlinLeft_tabline_0_1        ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444
highlight LightlinLeft_tabline_0_tabsel   ctermfg=0 ctermbg=0 guifg=#666666 guibg=#242424
highlight LightlinLeft_tabline_tabsel     ctermfg=0 ctermbg=0 guifg=#d0d0d0 guibg=#242424
highlight LightlinLeft_tabline_tabsel_0   ctermfg=0 ctermbg=0 guifg=#242424 guibg=#666666
highlight LightlinLeft_inactive_1         ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444
"
"
"
" TOGGLE INVISIBLES
" backslash l
let mapleader = "\\"
nmap <leader>l :set list!<CR>
set listchars=tab:▸\ ,eol:¬
"
"
"
" NERDTree defaults
nmap <leader>n :NERDTreeToggle<CR>
" backslash n
let g:NERDTreeFileExtensionHighlightFullName = 1
let NERDTreeWinPos=0
let NERDTreeShowHidden=1
"
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
"
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") && v:this_session == "" | NERDTree | endif
"
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | exe 'cd '.argv()[0] | endif
"
