var p = Ent.Project.create('polaris', 'js');
p.setVersion(1, 3, 0);
p.setBolt('library', '**/*.js');
p.setBoltTest();
