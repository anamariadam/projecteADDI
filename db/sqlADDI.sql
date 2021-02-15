create database if not exists projecte;
use projecte;

 create table if not exists usuaris(
 id_user int auto_increment primary key,
 nomUser varchar(10),
 contra varchar(10),
 nomComplet varchar(20),
 imgAvat blob
) ;

create table if not exists alumnes(
id_alumne int primary key,
curs int,
repetidor boolean,
foreign key (id_alumne) references usuaris(id_user) on delete cascade
);

create table if not exists profesores(
id_profesor int primary key,
departament varchar(10),
foreign key (id_profesor) references usuaris(id_user) on delete cascade
);

create table if not exists asignaturas(
 id_asignaturas int auto_increment primary key,
 nomCurt varchar(3),
 nomLlarg varchar(20),
 hores int,
 modul varchar(6),
 curs int
 );

create table if not exists docencia (
profe int , 
alumne int ,
asignatura int,
nota int,
foreign key (profe) references usuaris(id_user),
foreign key (alumne) references usuaris(id_user),
foreign key (asignatura) references asignaturas(id_asignaturas),
primary key (alumne,asignatura)
);

create table if not exists mensajeria(
id_mensajeria int auto_increment,
emisor int ,
receptor int ,
sms varchar(100),
img varchar(100),
foreign key (emisor) references usuaris(id_user),
foreign key (receptor) references usuaris(id_user),
primary key (id_mensajeria, emisor)
);

insert into usuaris (nomUser, contra,nomComplet) values ("Jose","password","Jose Sanz");
insert into usuaris (nomUser, contra,nomComplet) values ("Pedro","password","Pedro Martinez");
insert into usuaris (nomUser, contra,nomComplet) values ("Pablo","pass","alumne1complet");
insert into usuaris (nomUser, contra,nomComplet) values ("Maria","pass","Maria Ortiz");
insert into usuaris (nomUser, contra,nomComplet) values ("Jaime","pass","Jaime Perez");
insert into usuaris (nomUser, contra,nomComplet) values ("Daniel","pass","Daniel Abad");

insert into profesores (id_profesor, departament) values (1,"Refuerzo");
insert into profesores (id_profesor, departament) values (2,"Proyectos");

insert into alumnes (id_alumne, curs, repetidor) values (3,"1",true);
insert into alumnes (id_alumne, curs, repetidor) values (4,"1",false);
insert into alumnes (id_alumne, curs, repetidor) values (5,"2",false);
insert into alumnes (id_alumne, curs, repetidor) values (6,"2",true);

insert into asignaturas (nomCurt,nomLlarg,hores,modul,curs) values ("PRG","Programacio",8,"DAM",1);
insert into asignaturas (nomCurt,nomLlarg,hores,modul,curs) values ("LMI","Llenguaje de marques",5,"DAM",1);
insert into asignaturas (nomCurt,nomLlarg,hores,modul,curs) values ("AD","Acces a dades",6,"DAM",2);
insert into asignaturas (nomCurt,nomLlarg,hores,modul,curs) values ("DI","Diseny d'interficies",8,"DAM",2);

insert into docencia (profe, alumne, asignatura, nota) values (1,3,1,8);
insert into docencia (profe, alumne, asignatura, nota) values (2,4,2,7);
insert into docencia (profe, alumne, asignatura, nota) values (1,5,3,9);
insert into docencia (profe, alumne, asignatura, nota) values (2,6,4,6);