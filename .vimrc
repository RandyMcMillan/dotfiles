set go+=!,

autocmd! bufwritepost .vimrc source %

if has("autocmd")
    " configure expanding of tabs for various file types
    au BufRead,BufNewFile *.py set expandtab
    au BufRead,BufNewFile *.py set list
    au BufRead,BufNewFile *.h set noexpandtab
    au BufRead,BufNewFile *.c set noexpandtab
    au BufRead,BufNewFile *.cpp set noexpandtab
    au BufRead,BufNewFile *.h set list
    au BufRead,BufNewFile *.c set list
    au BufRead,BufNewFile *.cpp set list
endif

" GNUmakefile Makefile *.mk
if has("autocmd")
    autocmd FileType make              set noexpandtab
    autocmd FileType make              set softtabstop=4
    autocmd FileType make              set list

    au BufRead,BufNewFile Makefile     set noexpandtab
    au BufRead,BufNewFile Makefile     set softtabstop=4
    au BufRead,BufNewFile Makefile     set list

    au BufRead,BufNewFile GNUmakefile  set noexpandtab
    au BufRead,BufNewFile GNUmakefile  set softtabstop=4
    au BufRead,BufNewFile GNUmakefile  set list

    au BufRead,BufNewFile *.sh* set list
    au BufRead,BufNewFile *.vimrc* set list
    au BufRead,BufNewFile *.vimrc* set noexpandtab

    au BufRead,BufNewFile *ockerfile* set noexpandtab list
    au BufRead,BufNewFile *.yml  set noexpandtab softtabstop=2 list
    au BufRead,BufNewFile *.yaml set noexpandtab softtabstop=2 list

    au BufRead,BufNewFile *.md set noexpandtab
    au BufRead,BufNewFile *.md set softtabstop=4
    " au BufRead,BufNewFile *.md set expandtab!
    au BufRead,BufNewFile *.md set list
endif

" make backspaces more powerfull
set backspace=indent,eol,start

set ruler               " show line and column number
syntax on               " syntax highlighting
set showcmd             " show (partial) command in status line

" SOLARIZED HEX     16/8 TERMCOL  XTERM/HEX   L*A*B      sRGB        HSB
" --------- ------- ---- -------  ----------- ---------- ----------- -----------
" base03    #002b36  8/4 brblack  234 #1c1c1c 15 -12 -12   0  43  54 193 100  21
" base02    #073642  0/4 black    235 #262626 20 -12 -12   7  54  66 192  90  26
" base01    #586e75 10/7 brgreen  240 #4e4e4e 45 -07 -07  88 110 117 194  25  46
" base00    #657b83 11/7 bryellow 241 #585858 50 -07 -07 101 123 131 195  23  51
" base0     #839496 12/6 brblue   244 #808080 60 -06 -03 131 148 150 186  13  59
" base1     #93a1a1 14/4 brcyan   245 #8a8a8a 65 -05 -02 147 161 161 180   9  63
" base2     #eee8d5  7/7 white    254 #d7d7af 92 -00  10 238 232 213  44  11  93
" base3     #fdf6e3 15/7 brwhite  230 #ffffd7 97  00  10 253 246 227  44  10  99
" yellow    #b58900  3/3 yellow   136 #af8700 60  10  65 181 137   0  45 100  71
" orange    #cb4b16  9/3 brred    166 #d75f00 50  50  55 203  75  22  18  89  80
" red       #dc322f  1/1 red      160 #d70000 50  65  45 220  50  47   1  79  86
" magenta   #d33682  5/5 magenta  125 #af005f 50  65 -05 211  54 130 331  74  83
" violet    #6c71c4 13/5 brmagenta 61 #5f5faf 50  15 -45 108 113 196 237  45  77
" blue      #268bd2  4/4 blue      33 #0087ff 55 -10 -45  38 139 210 205  82  82
" cyan      #2aa198  6/6 cyan      37 #00afaf 60 -35 -05  42 161 152 175  74  63
" green     #859900  2/2 green     64 #5f8700 60 -20  65 133 153   0  68 100  60

set colorcolumn=40,50,79,81,129,131,159,161,209,211
if has("gui_running")
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

" highlight CursorLine    ctermbg=red guibg=grey ctermfg=grey guifg=grey
" highlight CursorColumn  ctermbg=red guibg=grey

" highlight LightlineLeft_tabline_0  ctermfg=252 ctermbg=242 guifg=#d0d0d0 guibg=#666666
" highlight LightlineLeft_tabline_0_1  ctermfg=242 ctermbg=238 guifg=#666666 guibg=#444444
" highlight LightlineLeft_tabline_0_tabsel  ctermfg=242 ctermbg=235 guifg=#666666 guibg=#242424
" highlight LightlineLeft_tabline_tabsel  ctermfg=252 ctermbg=235 guifg=#d0d0d0 guibg=#242424
" highlight LightlineLeft_tabline_tabsel_0  ctermfg=235 ctermbg=242 guifg=#242424 guibg=#666666
" highlight LightlineLeft_tabline_tabsel_1  ctermfg=235 ctermbg=238 guifg=#242424 guibg=#444444
" highlight LightlineLeft_tabline_tabsel_tabsel  ctermfg=235 ctermbg=235 guifg=#242424 guibg=#242424
" highlight LightlineRight_tabline_0  ctermfg=248 ctermbg=242 guifg=#a8a8a8 guibg=#666666
" highlight LightlineRight_tabline_0_1  ctermfg=242 ctermbg=238 guifg=#666666 guibg=#444444
" highlight LightlineRight_tabline_0_tabsel  ctermfg=242 ctermbg=235 guifg=#666666 guibg=#242424
" highlight LightlineRight_tabline_tabsel  ctermfg=252 ctermbg=235 guifg=#d0d0d0 guibg=#242424
" highlight LightlineRight_tabline_tabsel_0  ctermfg=235 ctermbg=242 guifg=#242424 guibg=#666666

" TOGGLE INVISIBLES
" backslash l
let mapleader = "\\"
nmap <leader>l :set list!<CR>
set listchars=tab:▸\ ,eol:¬
"

" NERDTree defaults
nmap <leader>n :NERDTreeToggle<CR>
" backslash n
let g:NERDTreeFileExtensionHighlightFullName = 1
let NERDTreeWinPos=0
let NERDTreeShowHidden=1
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
"
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") && v:this_session == "" | NERDTree | endif
"
autocmd StdinReadPre * let s:std_in=1
""
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | exe 'cd '.argv()[0] | endif
"
let NERDTreeWinPos=0
let NERDTreeShowHidden=1
"" Use the Solarized Dark theme
set background=dark
colorscheme solarized
set colorcolumn=40,50,79,81,129,131,159,161,209,211
" highlight ColorColumn ctermbg=0 guibg=lightgrey
"
let g:solarized_termtrans=1
"
"" Make Vim more useful
"set nocompatible
"" Use the OS clipboard by default (on versions compiled with `+clipboard`)
"set clipboard=unnamed
"" Enhance command-line completion
"set wildmenu
"" Allow cursor keys in insert mode
"set esckeys
"" Allow backspace in insert mode
"set backspace=indent,eol,start
"" Optimize for fast terminal connections
"set ttyfast
"" Add the g flag to search/replace by default
"set gdefault
"" Use UTF-8 without BOM
"set encoding=utf-8 nobomb
"" Don’t add empty newlines at the end of files
"set binary
"set noeol
"" Centralize backups, swapfiles and undo history
"set backupdir=~/.vim/backups
"set directory=~/.vim/swaps
"if exists("&undodir")
"	set undodir=~/.vim/undo
"endif
"
"" Don’t create backups when editing files in certain directories
"set backupskip=/tmp/*,/private/tmp/*
"
"" Respect modeline in files
"set modeline
"set modelines=4
"" Enable per-directory .vimrc files and disable unsafe commands in them
set exrc
"set secure
"
"" Enable syntax highlighting
"syntax on
"" enable all Python syntax highlighting features
"let python_highlight_all = 1
"" Highlight current line
"
"
"set cursorline
"" Make tabs as wide as two spaces
"set tabstop=4
"" Show “invisible” characters
"set lcs=tab:▸\ ,trail:·,eol:¬,nbsp:_
"set list
"" Highlight searches
"set hlsearch
"" Ignore case of searches
"set ignorecase
"" Highlight dynamically as pattern is typed
"set incsearch
"" Always show status line
"set laststatus=2
"" Enable mouse in all modes
"set mouse=a
"" Disable error bells
"" set noerrorbells
"" Don’t reset cursor to start of line when moving around.
"set nostartofline
"" Show the cursor position
"set ruler
"" Don’t nnoremapshow the intro message when starting Vim
"set shortmess=atI
"" Show the current mode
"set showmode
"" Show the filename in the window titlebar
"set title
"auto BufEnter * let &titlestring = hostname() . "/" . expand("%:p")
"
"" add useful stuff to title bar (file name, flags, cwd)
"" based on @factorylabs
"if has('title') && (has('gui_running') || &title)
""  set titlestring=
"    set titlestring+=%f
"    set titlestring+=%h%m%r%w
"    set titlestring+=\ -\ %{v:progname}
"    set titlestring+=\ -\ %{substitute(getcwd(),\ $HOME,\ '~',\ '')}
"endif
"
"
"" Show the (partial) command as it’s being typed
"set showcmd
"" Enable line numbers
"set number
"" Use hybrid line numbers
" if exists("&relativenumber")
"		set number relativenumber
"		au BufReadPost * set relativenumber
" endif
"
"" Start scrolling three lines before the horizontal window border
"set scrolloff=3
"
""" Strip trailing whitespace (,ss)
""function! StripWhitespace()
""	let save_cursor = getpos(".")
""	let old_query = getreg('/')
""	:%s/\s\+$//e
""	call setpos('.', save_cursor)
""	call setreg('/', old_query)
""endfunction
""noremap <leader>ss :call StripWhitespace()<CR>
"
"" Save a file as root (,W)
"noremap <leader>WW :w !sudo tee % > /dev/null<CR>
"
"" Automatic commands
"if has("autocmd")
"	" Enable file type detection
"	filetype on
"	" Treat .json files as .js
"	autocmd BufNewFile,BufRead *.json setfiletype json syntax=javascript
"	" Treat .md files as Markdown
"	autocmd BufNewFile,BufRead *.md setlocal filetype=markdown
"endif
"
"" --------------------------------------------------------------------------------
"" configure editor with tabs and nice stuff...
"" --------------------------------------------------------------------------------
"" NOTE: effects git message editing
"set nocompatible
"set expandtab           " enter spaces when tab is pressed
"set textwidth=160       " break lines when line length increases
"set tabstop=4           " use 4 spaces to represent tab
"set softtabstop=4
"set shiftwidth=4        " number of spaces to use for auto indent
"set autoindent          " copy indent from current line when starting a new line
"set smartindent
"set smarttab!
"set number
"
"let g:clang_format#style_options = {
"            \ "AccessModifierOffset" : -4,
"            \ "AllowShortIfStatementsOnASingleLine" : "true",
"            \ "AlwaysBreakTemplateDeclarations" : "true",
"            \ "Standard" : "C++11"}
"
"if has("autocmd")
"    " map to <Leader>cf in C++ code
"    " autocmd FileType c,cpp,objc nnoremap <buffer><Leader>cf :<C-u>ClangFormat<CR>
"    " autocmd FileType c,cpp,objc vnoremap <buffer><Leader>cf :ClangFormat<CR>
"    " if you install vim-operator-user
"    " autocmd FileType c,cpp,objc map <buffer><Leader>x <Plug>(operator-clang-format)
"endif
"
"" Toggle auto formatting:
"" nmap <Leader>C :ClangFormatAutoToggle<CR>
"
"set noexpandtab " default dont mess with tabs!!!
"" set expandtab!
"set list       " default show stuff!!! "
":inoremap <cr> <space><bs><cr>
":inoremap <cr> <tab><bs><cr>
"
"if has("autocmd")
"    " configure expanding of tabs for various file types
"    au BufRead,BufNewFile *.py set expandtab
"    au BufRead,BufNewFile *.py set list
"    au BufRead,BufNewFile *.h set noexpandtab
"    au BufRead,BufNewFile *.c set noexpandtab
"    au BufRead,BufNewFile *.cpp set noexpandtab
"    au BufRead,BufNewFile *.h set list
"    au BufRead,BufNewFile *.c set list
"    au BufRead,BufNewFile *.cpp set list
"endif
"
"" GNUmakefile Makefile *.mk
"if has("autocmd")
"    autocmd FileType make              set noexpandtab
"    autocmd FileType make              set softtabstop=4
"    autocmd FileType make              set list
"
"    au BufRead,BufNewFile Makefile     set noexpandtab
"    au BufRead,BufNewFile Makefile     set softtabstop=4
"    au BufRead,BufNewFile Makefile     set list
"
"    au BufRead,BufNewFile GNUmakefile  set noexpandtab
"    au BufRead,BufNewFile GNUmakefile  set softtabstop=4
"    au BufRead,BufNewFile GNUmakefile  set list
"
"    au BufRead,BufNewFile *.sh* set list
"    au BufRead,BufNewFile *.vimrc* set list
"    au BufRead,BufNewFile *.vimrc* set noexpandtab
"
"    au BufRead,BufNewFile *ockerfile* set noexpandtab list
"    au BufRead,BufNewFile *.yml  set noexpandtab softtabstop=2 list
"    au BufRead,BufNewFile *.yaml set noexpandtab softtabstop=2 list
"
"    au BufRead,BufNewFile *.md set noexpandtab
"    au BufRead,BufNewFile *.md set softtabstop=4
"    " au BufRead,BufNewFile *.md set expandtab!
"    au BufRead,BufNewFile *.md set list
"endif
"
"" make backspaces more powerfull
set backspace=indent,eol,start
"
set ruler               " show line and column number
syntax on               " syntax highlighting
set showcmd             " show (partial) command in status line
"
"
"" clang format and code completion support
"" path to directory where library can be found
"let g:clang_library_path='/Library/Developer/CommandLineTools/usr/lib/'
"" or path directly to the library file
"" let g:clang_library_path='/usr/lib64/libclang.so.3.8'
"
""m autocmd FileType c ClangFormatAutoEnable
"
"
"if has("autocmd")
"function! s:expand_commit_template() abort
"  let context = {
"        \ 'MY_BRANCH': matchstr(system('git rev-parse --abbrev-ref HEAD'), '\p\+'),
"        \ 'AUTHOR': 'Tommy A',
"        \ }
"
"  let lnum = nextnonblank(1)
"  while lnum && lnum < line('$')
"    call setline(lnum, substitute(getline(lnum), '\${\(\w\+\)}',
"          \ '\=get(context, submatch(1), submatch(0))', 'g'))
"    let lnum = nextnonblank(lnum + 1)
"  endwhile
"endfunction
"endif
"
"autocmd BufRead */.git/COMMIT_EDITMSG call s:expand_commit_template()
